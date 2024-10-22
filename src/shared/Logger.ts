import ElasticApmNode from "elastic-apm-node";
import moment from "moment";
import { IElasticDataLogger, ILogLevel, ILogLevels } from "../interfaces/LogInterface.ts";
import { IdGenerate } from "../utils/IdGenerate.ts";
import { ApmService } from "./apm/ElasticApm.ts";
import { elasticClient } from "./apm/ElasticCLient.ts";

export class Logger {
	private readonly entity: string;
	private logger: ElasticApmNode.Logger;

	constructor(entity: string) {
		this.entity = entity;
		this.logger = new ApmService().elasticLogger();
	}
	private createLogData<T>(level: ILogLevels, data: ILogLevel<T>): IElasticDataLogger<T> {
		return {
			trace_id: IdGenerate(),
			entity: this.entity,
			entity_id: data.entityId,
			is_error: level === "error",
			status_code: data.statusCode,
			description: data.description,
			title: data.title,
			datetime: moment().utc().toDate(),
			objectData: data.objectData,
		};
	}

	private async log<T>(level: ILogLevels, data: ILogLevel<T>) {
		const logData = this.createLogData(level, data);

		this.logger[level](logData.description, logData);

		await elasticClient.create({
			id: logData.trace_id,
			index: logData.entity,
			body: logData,
		});
	}

	public async debug<T>({ entityId, title, description, statusCode, objectData }: ILogLevel<T>) {
		await this.log("debug", { entityId, title, description, statusCode, objectData });
	}

	public async info<T>({ entityId, title, description, statusCode, objectData }: ILogLevel<T>) {
		await this.log("info", { entityId, title, description, statusCode, objectData });
	}

	public async error<T>({ entityId, title, description, statusCode, objectData }: ILogLevel<T>) {
		await this.log("error", { entityId, title, description, statusCode, objectData });
	}

	public async warn<T>({ entityId, title, description, statusCode, objectData }: ILogLevel<T>) {
		await this.log("warn", { entityId, title, description, statusCode, objectData });
	}
}
