import { IDefaultReturns, IDefaultReturnsCreated, IDefaultReturnsSuccess, STATUS_CODES } from "../interfaces/AppInterface.ts";

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
}
