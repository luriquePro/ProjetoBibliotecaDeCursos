import { IRequestCounter } from "../interfaces/AppInterface.ts";

export class RedisRepository {
	constructor(private readonly redisClient: any) {
		this.redisClient.on("error", (err: string) => {
			console.error("Redis Client Error", err);
		});

		this.redisClient.connect().then(() => console.log("Redis connected!"));
	}

	public async saveRequestCounter(key: string, requestCounter: IRequestCounter, timeEXP: number) {
		await this.redisClient.set(key, JSON.stringify(requestCounter), { EX: timeEXP });
	}

	public async getRequestCounter(key: string) {
		return await this.redisClient.get(key);
	}
}
