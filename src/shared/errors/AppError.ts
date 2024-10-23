import { ClientSession } from "mongoose";

export class AppError extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode = 500, session?: ClientSession) {
		if (session) {
			session.abortTransaction().then(() => session.endSession());
		}
		super(message);
		this.statusCode = statusCode;
	}
}

export class BadRequestError extends AppError {
	constructor(message: string, session?: ClientSession) {
		super(message, 400, session);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string, session?: ClientSession) {
		super(message, 404, session);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message: string, session?: ClientSession) {
		super(message, 401, session);
	}
}

export class CustomError extends Error {
	public readonly statusCode: number;
	public readonly customError: boolean;
	constructor(message: object, statusCode: number, session?: ClientSession) {
		if (session) {
			session.abortTransaction().then(() => session.endSession());
		}

		super(JSON.stringify(message));
		this.statusCode = statusCode;
		this.customError = true;
	}
}
