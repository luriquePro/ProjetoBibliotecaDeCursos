import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { ObservabilityApm } from "./middlewares/ObservabilityMiddleware.ts";
import { routes } from "./routes.ts";
import { ApmService } from "./shared/apm/ElasticApm.ts";

new ApmService().startElastic();

const app = express();

const IS_PRODUCTION = process.env.NODE_ENV === "PROD";
const IPS = process.env.IPS;

const whitelist = IPS?.split(",")! ?? ["http://localhost:3333"];
const corsOptions = {
	origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	},
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions as any));
app.use(ObservabilityApm);

const URL = process.env.MONGODB_URI!;
mongoose
	.connect(URL, { dbName: process.env.MONGODB_DATABASE })
	.then(() => console.log(`MongoDB connected!`))
	.then(() => app.use(routes))
	.catch(err => console.log("Error to connect mongoDB"));

export { app };
