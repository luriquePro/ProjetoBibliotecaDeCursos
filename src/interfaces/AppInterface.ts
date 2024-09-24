export interface IRequestCounter {
	count: number;
	limit_datetime: string;
}

export interface IRateLimit {
	timeLimitInSeconds?: number;
	limitRequestPerTime?: number;
	messageInError?: string;
}
