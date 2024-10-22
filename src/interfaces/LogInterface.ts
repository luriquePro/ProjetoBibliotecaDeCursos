import { STATUS_CODES } from "./AppInterface.ts";

export interface ILog {
	traceId: number;
	entityId: string;
	entity: string;
	message: string;
	statusCode: number;
}

export interface IElasticDataLogger<T> {
	trace_id: string;
	entity: string;
	entity_id: string;
	is_error: boolean;
	status_code: STATUS_CODES;
	description: string;
	title: string;
	datetime: Date;
	objectData?: T;
}

export interface ILogLevel<T> {
	entityId: string;
	title: string;
	description: string;
	statusCode: STATUS_CODES;
	objectData?: T;
}

export interface ILogFindByObj {
	index: string;
	id: string;
}

export type ILogLevels = "debug" | "warn" | "info" | "error";
