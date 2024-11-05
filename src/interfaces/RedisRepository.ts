import { IRequestCounter } from "./AppInterface.ts";
import { IResetPasswordCode, IShowUserReturn } from "./UserInterface.ts";

export interface IRedisRepository {
	saveRequestCounter(key: string, requestCounter: IRequestCounter, timeEXP: number): Promise<void>;
	getRequestCounter(key: string): Promise<string | null>;
	saveResetPasswordCode(resetCode: IResetPasswordCode, timeEXP: number): Promise<void>;
	getResetPasswordCode(resetCode: string): Promise<IResetPasswordCode | null>;
	saveShowUserCache(userId: string, dataShow: IShowUserReturn): Promise<void>;
	getShowUserCache(userId: string): Promise<IShowUserReturn | null>;
	delShowUserCache(userId: string): Promise<void>;
}
