import { createClient } from "redis";

const client = createClient({ url: "redis://127.0.0.1:6379", database: Number(process.env.REDIS_DB_CONNECTION_DATABASE) });

export { client };
