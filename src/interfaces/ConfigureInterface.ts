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

export interface IConfiguresRepository {
	getConfig(config: string): Promise<boolean | string | number | undefined>;
	findOneByObj(filter: FilterQuery<IConfiguresDTO>): Promise<IConfiguresDTO | null>;
	create(dataConfigure: IConfiguresCreateDTO): Promise<IConfiguresDTO>;
}

export interface IConfiguresService {
	createConfigure(dataConfigure: IConfiguresCreateDTO): Promise<string>;
}

export interface IConfiguresValidations {
	createConfigure(dataConfigure: IConfiguresCreateDTO): Promise<void>;
}
