import { FilterQuery } from "mongoose";
import { CONFIGURE_STATUS } from "../constants/CONFIGURE.ts";

export interface IConfigures {
	config: string;
	value: string | number | boolean;
	status: CONFIGURE_STATUS;
}

export interface IConfigureRepository {
	getConfig(config: string): Promise<boolean | string | number | undefined>;
	findOneByObj(filter: FilterQuery<IConfigures>): Promise<IConfigures | null>;
}
