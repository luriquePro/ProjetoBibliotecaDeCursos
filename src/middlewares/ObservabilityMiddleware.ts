import ElasticApmNode from "elastic-apm-node";
import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../interfaces/AppInterface.ts";

const ObservabilityApm = (req: Request, res: Response, next: NextFunction) => {
	const transaction = ElasticApmNode.startTransaction(req.method + " " + req.path, "request");
	res.on("finish", () => {
		switch (res.statusCode) {
			case STATUS_CODES.OK:
				transaction.result = "SUCESS";
				break;
			case STATUS_CODES.CREATED:
				transaction.result = "CREATED";
				break;
			case STATUS_CODES.BAD_REQUEST:
				transaction.result = "BAD_REQUEST";
				break;
			case STATUS_CODES.UNAUTHORIZED:
				transaction.result = "UNAUTHORIZED";
				break;
			case STATUS_CODES.NOT_FOUND:
				transaction.result = "NOT_FOUND";
				break;
			case STATUS_CODES.INTERNAL_ERROR:
				transaction.result = "INTERNAL_ERROR";
				break;
			default:
				transaction.result = "ERROR";
				break;
		}

		transaction.end();
	});
	next();
};

export { ObservabilityApm };
