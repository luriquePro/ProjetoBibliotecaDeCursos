import { IDefaultReturns, IDefaultReturnsCreated, IDefaultReturnsError, IDefaultReturnsSuccess, STATUS_CODES } from "../interfaces/AppInterface.ts";

export class DefaultReturns {
	static success<T>(data: IDefaultReturns<T>): IDefaultReturnsSuccess<T> {
		return {
			is_error: false,
			message: data.message,
			status_code: STATUS_CODES.OK,
			body: data.body,
		};
	}

	static created<T>(data: IDefaultReturns<T>): IDefaultReturnsCreated<T> {
		return {
			is_error: false,
			status_code: STATUS_CODES.CREATED,
			message: data.message,
			body: data.body,
		};
	}

	static error<T>(data: IDefaultReturns<T>): IDefaultReturnsError<T> {
		return {
			is_error: true,
			status_code: data.status_code!,
			message: data.message,
			code_error: data.code_error,
			body: data.body,
		};
	}
}
