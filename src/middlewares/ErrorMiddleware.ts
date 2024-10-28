import { NextFunction, Request, Response } from "express";
import { DefaultReturns } from "../shared/DefaultReturns.ts";
import { AppError, CustomError } from "../shared/errors/AppError.ts";

export const ErrorMiddleware = (error: Error & Partial<AppError> & Partial<CustomError>, req: Request, res: Response, next: NextFunction) => {
	const statusCode = error.statusCode ?? 500;
	const message = error.statusCode ? error.message : "Internal Server Error";

	if (error.customError) {
		console.log(JSON.parse(message));
		const { message: messageError, code_error, ...rest } = JSON.parse(message);
		return res.json(DefaultReturns.error({ message: messageError, status_code: statusCode, code_error, body: rest }));
	} else {
		res.status(statusCode);
		return res.json(DefaultReturns.error({ message, status_code: statusCode, code_error: undefined, body: undefined }));
	}
};
