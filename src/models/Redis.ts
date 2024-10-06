import { createClient } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || "6379";

const client = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}`, database: Number(process.env.REDIS_DB_CONNECTION_DATABASE) });

export { client };
