import { NextFunction, Request, Response } from "express";
import { client } from "../models/Redis.ts";
import moment from "moment";
import { IRateLimit, IRequestCounter } from "../interfaces/AppInterface.ts";
import { RedisRepository } from "../repositories/RedisRepository.ts";

const redisRepository = new RedisRepository(client);

export const RateLimit =
	({ timeLimitInSeconds = 30, limitRequestPerTime = 10, messageInError }: IRateLimit = {}) =>
	async (request: Request, response: Response, next: NextFunction) => {
		// get User Data
		const userIp = request.headers["x-forwarded-for"] || request.socket.remoteAddress;
		const { path } = request.route;

		// Counter Requests Key
		const key = `rate-limit-${path}-${userIp}`;

		// Get Request Counter
		const requestCounterJson = await redisRepository.getRequestCounter(key);
		if (!requestCounterJson) {
			const requestCounterObject: IRequestCounter = {
				count: 1,
				limit_datetime: moment().utc().add(timeLimitInSeconds, "seconds").toISOString(),
			};

			// Set a first request counter
			await redisRepository.saveRequestCounter(key, requestCounterObject, timeLimitInSeconds);
			return next();
		}

		// Tranform JSON request Counter in Object
		const requestCounterObject: IRequestCounter = JSON.parse(requestCounterJson);
		const newRequestCounterObject: IRequestCounter = {
			count: requestCounterObject.count + 1,
			limit_datetime: requestCounterObject.limit_datetime,
		};

		// Get restTime to EXP
		const restTime = moment(requestCounterObject.limit_datetime).diff(moment().utc(), "seconds");

		// Inc counter and save
		await redisRepository.saveRequestCounter(key, newRequestCounterObject, restTime);

		// Check if time is over
		if (moment(requestCounterObject.limit_datetime).isSameOrAfter(moment().utc())) {
			// Check if limitRequestPerTime is over
			if (requestCounterObject.count >= limitRequestPerTime) {
				return response.status(429).json({
					message: messageInError ?? `Too many requests. Please try again in ${restTime} seconds`,
					request_counter: newRequestCounterObject.count,
					path,
					time_remaining: restTime,
					is_error: true,
				});
			}
		}

		return next();
	};
