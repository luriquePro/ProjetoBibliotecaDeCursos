import { captureRedisAction } from "../decorators/captureRedisAction.ts";
import { IRequestCounter } from "../interfaces/AppInterface.ts";
import { IRedisRepository } from "../interfaces/RedisRepository.ts";
import { IResetPasswordCode, IShowUserReturn } from "../interfaces/UserInterface.ts";

export class RedisRepository implements IRedisRepository {
	constructor(private readonly redisClient: any) {
		this.redisClient.on("error", (err: string) => {
			console.error("Redis Client Error", err);
		});

		if (!this.redisClient.isOpen) {
			this.redisClient.connect().then(() => console.log("Redis connected!"));
		}
	}

	@captureRedisAction("saveRequestCounter")
	public async saveRequestCounter(key: string, requestCounter: IRequestCounter, timeEXP: number) {
		await this.redisClient.set(key, JSON.stringify(requestCounter), { EX: timeEXP });
	}

	@captureRedisAction("getRequestCounter")
	public async getRequestCounter(key: string) {
		return await this.redisClient.get(key);
	}

	@captureRedisAction("saveResetPasswordCode")
	public async saveResetPasswordCode(resetCode: IResetPasswordCode, timeEXP: number) {
		const key = `reset-password-code-${resetCode.code}`;
		await this.redisClient.set(key, JSON.stringify(resetCode), { EX: timeEXP });
	}

	@captureRedisAction("getResetPasswordCode")
	public async getResetPasswordCode(resetCode: string): Promise<IResetPasswordCode | null> {
		const key = `reset-password-code-${resetCode}`;
		const result = await this.redisClient.get(key);

		if (result) {
			return JSON.parse(result);
		}

		return null;
	}

	@captureRedisAction("saveShowUserCache")
	public async saveShowUserCache(userId: string, dataShow: IShowUserReturn): Promise<void> {
		const key = `show-user-${userId}`;
		await this.redisClient.set(key, JSON.stringify(dataShow), { EX: 3600 });
	}

	@captureRedisAction("getShowUserCache")
	public async getShowUserCache(userId: string): Promise<IShowUserReturn | null> {
		const key = `show-user-${userId}`;
		const result = await this.redisClient.get(key);

		if (result) {
			return JSON.parse(result);
		}

		return null;
	}

	@captureRedisAction("delShowUserCache")
	public async delShowUserCache(userId: string): Promise<void> {
		const key = `show-user-${userId}`;
		await this.redisClient.del(key);
	}
}
