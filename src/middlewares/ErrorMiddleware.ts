import { NextFunction, Request, Response } from "express";
import { AppError, CustomError } from "../shared/errors/AppError.ts";

export const ErrorMiddleware = (error: Error & Partial<AppError> & Partial<CustomError>, req: Request, res: Response, next: NextFunction) => {
	const statusCode = error.statusCode ?? 500;
	const message = error.statusCode ? error.message : "Internal Server Error";

	if (error.customError) {
		return res.status(statusCode).json(JSON.parse(message));
	} else {
		return res.status(statusCode).json({ message });
	}
};
