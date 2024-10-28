import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import { CODE_ERRORS } from "../constants/ERRORS.ts";
import { SESSION_STATUS, USER_STATUS } from "../constants/USER.ts";
import { ITokenCreateDTO } from "../interfaces/UserInterface.ts";
import { SessionModel } from "../models/Session.ts";
import { UserModel } from "../models/User.ts";
import { SessionRepository } from "../repositories/SessionRepository.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { CustomError } from "../shared/errors/AppError.ts";
import { Logger } from "../shared/Logger.ts";
const IsAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
	const logger = new Logger("user");

	const token = req.headers["x-access-token"] as string;
	if (!token) {
		resetRequest(req);

		await logger.error({
			entityId: "NE",
			statusCode: 401,
			title: "Invalid Request",
			description: "Send a new request to authenticate with an invalid token",
			objectData: { token },
		});

		throw new CustomError(
			{
				message: "Invalid Request",
				logout: true,
				code_error: CODE_ERRORS.user.userMiddlewareErrorInvalidRequest + "01",
			},
			401,
		);
	}

	const userRepository = new UserRepository(UserModel);
	let userId = null;
	let sessionId = null;

	try {
		const dataToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as ITokenCreateDTO;

		userId = dataToken.userId;
		sessionId = dataToken.sessionId;
	} catch (error) {
		resetRequest(req);

		await logger.error({
			entityId: "NE",
			statusCode: 401,
			title: "Error to decript the token",
			description: "Send a new request to authenticate with an invalid token",
			objectData: error,
		});

		throw new CustomError(
			{
				message: "Invalid Request",
				logout: true,
				code_error: CODE_ERRORS.user.userMiddlewareErrorInvalidRequest + "02",
			},
			401,
		);
	}

	const user = await userRepository.findOneByObj({ id: userId });
	if (!user || user.status != USER_STATUS.ACTIVE) {
		resetRequest(req);

		await logger.error({
			entityId: "NE",
			statusCode: 401,
			title: "Invalid Request",
			description: "Send a new request to authenticate with an invalid token",
			objectData: { token },
		});

		throw new CustomError(
			{
				message: "Invalid Request",
				logout: true,
				code_error: CODE_ERRORS.user.userMiddlewareErrorInvalidRequest + "03",
			},
			401,
		);
	}

	if (user.current_token !== token) {
		resetRequest(req);

		await logger.error({
			entityId: "NE",
			statusCode: 401,
			title: "Invalid Request With Different Token",
			description: "Send a new request to authenticate with an token different to the user current token",
			objectData: { token },
		});

		throw new CustomError(
			{
				message: "Invalid Request",
				logout: true,
				code_error: CODE_ERRORS.user.userMiddlewareErrorInvalidRequest + "04",
			},
			401,
		);
	}

	const sessionRepository = new SessionRepository(SessionModel);
	const session = await sessionRepository.findOneByObj({
		user: user.id,
		status: SESSION_STATUS.ACTIVE,
		end_session: { $gt: moment().utc().toDate() },
		id: sessionId,
	});

	if (!session) {
		await sessionRepository.updateByObj({ user: user.id, id: sessionId }, { status: SESSION_STATUS.DISABLED });

		resetRequest(req);

		await logger.error({
			entityId: "NE",
			statusCode: 401,
			title: "Invalid Request",
			description: "Send a new request to authenticate with session not active",
			objectData: {
				token,
				user: user.id,
				id: sessionId,
			},
		});

		throw new CustomError(
			{
				message: "Sessão expirada, faça login novamente",
				logout: true,
				code_error: CODE_ERRORS.user.userMiddlewareErrorSessionExpired + "01",
			},
			401,
		);
	}

	req.user = user;
	req.session = session;
	req.is_authenticated = true;

	return next();
};

export { IsAuthenticate };

const resetRequest = (req: Request) => {
	req.user = undefined;
	req.session = undefined;
	req.is_authenticated = false;
};
