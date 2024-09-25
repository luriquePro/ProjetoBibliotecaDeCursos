import { IRequestCounter } from "./AppInterface.ts";
import { IResetPasswordCode } from "./UserInterface.ts";

export interface IRedisRepository {
	saveRequestCounter(key: string, requestCounter: IRequestCounter, timeEXP: number): Promise<void>;
	getRequestCounter(key: string): Promise<string | null>;
	saveResetPasswordCode(resetCode: IResetPasswordCode, timeEXP: number): Promise<void>;
	getResetPasswordCode(resetCode: string): Promise<IResetPasswordCode | null>;
}
