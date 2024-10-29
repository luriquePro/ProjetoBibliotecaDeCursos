import { FilterQuery, Model } from "mongoose";
import { CONFIGURE_STATUS } from "../constants/CONFIGURE.ts";
import { IConfiguresCreateDTO, IConfiguresDTO, IConfiguresRepository } from "../interfaces/ConfigureInterface.ts";
import { IConfiguresMongo } from "../models/Configures.ts";

class ConfiguresRepository implements IConfiguresRepository {
	constructor(private readonly configuresModel: Model<IConfiguresMongo>) {}

	public async findOneByObj(filter: FilterQuery<IConfiguresDTO>): Promise<IConfiguresDTO | null> {
		return await this.configuresModel.findOne(filter).lean();
	}

	public async getConfig(config: string): Promise<boolean | string | number | undefined> {
		const result = await this.findOneByObj({ config, status: CONFIGURE_STATUS.ACTIVE });
		return result?.value;
	}

	public async create(dataConfigure: IConfiguresCreateDTO): Promise<IConfiguresDTO> {
		return this.configuresModel.create(dataConfigure);
	}
}

export { ConfiguresRepository };
