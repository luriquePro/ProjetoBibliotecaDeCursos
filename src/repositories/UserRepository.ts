import { FilterQuery, Model, UpdateQuery } from "mongoose";

import { captureOperation } from "../decorators/captureMongooseOperation.ts";
import { IUserDTO, IUserRegisterRepository, IUserRepository } from "../interfaces/UserInterface.ts";
import { IUserMongo } from "../models/User.ts";

class UserRepository implements IUserRepository {
	constructor(private readonly userModel: Model<IUserMongo>) {}

	@captureOperation("findOne", "Users")
	public async findOneByObj(filter: FilterQuery<IUserDTO>): Promise<IUserDTO | null> {
		const result = await this.userModel.findOne(filter).lean();
		return result;
	}

	@captureOperation("findOne", "Users")
	public async findUserById(id: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ id });
	}

	@captureOperation("findOne", "Users")
	public async findUserByEmail(email: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ email });
	}

	@captureOperation("findOne", "Users")
	public async findUserByLogin(login: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ login });
	}

	@captureOperation("findOne", "Users")
	public async findUserByCPF(login: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ cpf: login });
	}

	@captureOperation("create", "Users")
	public async createUser(user: IUserRegisterRepository): Promise<IUserDTO> {
		return await this.userModel.create(user);
	}

	@captureOperation("update", "Users")
	public async updateUser(filter: FilterQuery<IUserDTO>, dataUpdate: UpdateQuery<IUserDTO>): Promise<IUserDTO | null> {
		return await this.userModel.findOneAndUpdate(filter, dataUpdate);
	}
}

export { UserRepository };
