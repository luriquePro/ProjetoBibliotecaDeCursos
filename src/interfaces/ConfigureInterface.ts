import { FilterQuery } from "mongoose";
import { CONFIGURE_STATUS } from "../constants/CONFIGURE.ts";

export interface IConfiguresDTO {
	config: string;
	value: string | number | boolean;
	status: CONFIGURE_STATUS;
}
export interface IConfiguresCreateDTO {
	config: string;
	value: string | number | boolean;
}

export type CONFIGURE_TYPE = boolean | string | number;

export interface IConfiguresRepository {
	getConfig(config: string): Promise<CONFIGURE_TYPE | undefined>;
	findOneByObj(filter: FilterQuery<IConfiguresDTO>): Promise<IConfiguresDTO | null>;
	create(dataConfigure: IConfiguresCreateDTO): Promise<IConfiguresDTO>;
}

export interface IConfiguresService {
	createConfigure(dataConfigure: IConfiguresCreateDTO): Promise<string>;
	getConfigure(config: string): Promise<CONFIGURE_TYPE>;
}

export interface IConfiguresValidations {
	createConfigure(dataConfigure: IConfiguresCreateDTO): Promise<void>;
}
