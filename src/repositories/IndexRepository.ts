import { Model } from "mongoose";
import { IIndexMongo } from "../models/Index.ts";
import { IIndexDTO, IIndexFind, IIndexRepository } from "../interfaces/IndexInterface.ts";

class IndexRepository implements IIndexRepository {
	constructor(private readonly indexModel: Model<IIndexMongo>) {}
	public async findOneByObj(filter: IIndexFind): Promise<IIndexDTO | null> {
		const result = await this.indexModel.findOne(filter);
		return result;
	}
}

export { IndexRepository };
