import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { IApp } from "./interfaces/AppInterface.ts";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware.ts";
import { ObservabilityApm } from "./middlewares/ObservabilityMiddleware.ts";
import { routes } from "./routes.ts";
import { ApmService } from "./shared/apm/ElasticApm.ts";

class App implements IApp {
	public express: Application;
	public isProduction: boolean;
	public formatError: boolean;
	private ips: string;
	private whitelistIps: string[] = [];
	private corsOptions = this.getCorsOptions();

	public constructor() {
		this.express = express();
		this.isProduction = process.env.NODE_ENV === "production" ? true : false;
		this.formatError = process.env.FORMAT_SHOW_ERRORS === "true" ? true : false;
		this.ips = process.env.IPS!;

		this.whitelistIps = this.ips.split(",")! ?? ["http://localhost:3333"];

		this.express.use("/tmp", express.static(__dirname + "/tmp"));

		new ApmService().startElastic();

		this.middlewarePreRoute();
		this.database()
			.then(() => this.routes())
			.then(() => this.middlewaresPosRoute());
	}

	private middlewarePreRoute() {
		this.express.use(cors(this.corsOptions as unknown as cors.CorsOptions));
		this.express.use(express.json());
		this.express.use(ObservabilityApm);
		this.express.disable("X-Powered-By");
	}

	private async database() {
		const URL = process.env.MONGODB_URI!;
		mongoose
			.connect(URL, { dbName: process.env.MONGODB_DATABASE })
			.then(() => console.log(`MongoDB connected!`))
			.catch(err => console.log("Error to connect mongoDB"));
	}

	private routes(): void {
		this.express.use(routes);
	}

	private middlewaresPosRoute(): void {
		if (this.formatError) {
			this.express.use(ErrorMiddleware);
		}
	}

	private getCorsOptions() {
		return {
			origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
				if (this.whitelistIps.indexOf(origin) !== -1) {
					callback(null, true);
				} else {
					callback(null, false);
				}
			},
		};
	}
}

export { App };
