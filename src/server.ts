import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { routes } from "./routes.ts";

dotenv.config();

const IS_PRODUCTION = process.env.NODE_ENV === "PROD";
const IPS = process.env.IPS;

const whitelist = IPS?.split(",")!;
const corsOptions = {
	origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	},
};

const app = express();

app.use(routes);

if (IS_PRODUCTION) {
	app.use(cors(corsOptions as any));
}

export { app };
