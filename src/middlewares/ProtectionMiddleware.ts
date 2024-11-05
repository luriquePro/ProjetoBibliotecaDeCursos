import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CODE_ERRORS } from "../constants/ERRORS.ts";
import { Logger } from "../shared/Logger.ts";
import { CustomError } from "../shared/errors/AppError.ts";

const isProtection = async (req: Request, res: Response, next: NextFunction) => {
	const logger = new Logger("protectionMiddleware");

	const token = req.headers["x-private-token"] as string;
	if (!token) {
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
				code_error: CODE_ERRORS.user.protectionMiddlewareErrorNotAllowed + "01",
			},
			401,
		);
	}

	let login = null;
	let password = null;

	try {
		const dataToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { login: string; password: string };

		login = dataToken.login;
		password = dataToken.password;
	} catch (error) {
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
				code_error: CODE_ERRORS.user.protectionMiddlewareErrorNotAllowed + "03",
			},
			401,
		);
	}

	const [SYSTEM_LOGIN, SYSTEM_PASSWORD] = [process.env.SYSTEM_LOGIN, process.env.SYSTEM_PASSWORD];

	if (login !== SYSTEM_LOGIN || password !== SYSTEM_PASSWORD) {
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
				code_error: CODE_ERRORS.user.protectionMiddlewareErrorNotAllowed + "02",
			},
			401,
		);
	}

	return next();
};

export { isProtection };
