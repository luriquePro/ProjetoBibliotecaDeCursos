export interface IRequestCounter {
	count: number;
	limit_datetime: string;
}

export interface IRateLimit {
	timeLimitInSeconds?: number;
	limitRequestPerTime?: number;
	messageInError?: string;
}

export enum STATUS_CODES {
	OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	INTERNAL_ERROR = 500,
}

export interface IDefaultReturns<T> {
	message: string;
	body: T;
}

export interface IDefaultReturnsSuccess<T> extends IDefaultReturns<T> {
	status_code: STATUS_CODES.OK;
	is_error: false;
}

export interface IDefaultReturnsCreated<T> extends IDefaultReturns<T> {
	is_error: false;
	status_code: STATUS_CODES.CREATED;
}
