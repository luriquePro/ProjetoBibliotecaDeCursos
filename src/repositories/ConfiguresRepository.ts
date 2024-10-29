import { FilterQuery, Model } from "mongoose";
import { CONFIGURE_STATUS } from "../constants/CONFIGURE.ts";
import { IConfigureRepository, IConfigures } from "../interfaces/ConfigureInterface.ts";
import { IConfiguresMongo } from "../models/Configures.ts";

class ConfiguresRepository implements IConfigureRepository {
	constructor(private readonly configuresModel: Model<IConfiguresMongo>) {}

	public async findOneByObj(filter: FilterQuery<IConfigures>): Promise<IConfigures | null> {
		const result = await this.configuresModel.findOne(filter).lean();
		return result;
	}

	public async getConfig(config: string): Promise<boolean | string | number | undefined> {
		const result = await this.findOneByObj({ config, status: CONFIGURE_STATUS.ACTIVE });
		return result?.value;
	}
}

export { ConfiguresRepository };
