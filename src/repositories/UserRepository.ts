import { FilterQuery, Model, UpdateQuery } from "mongoose";

import { IUserDTO, IUserRegisterRepository, IUserRepository } from "../interfaces/UserInterface.ts";
import { IUserMongo } from "../models/User.ts";

class UserRepository implements IUserRepository {
	constructor(private readonly userModel: Model<IUserMongo>) {}
	public async findOneByObj(filter: FilterQuery<IUserDTO>): Promise<IUserDTO | null> {
		const result = await this.userModel.findOne(filter);
		return result;
	}

	public async findUserById(id: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ id });
	}

	public async findUserByEmail(email: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ email });
	}

	public async findUserByLogin(login: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ login });
	}

	public async findUserByCPF(login: string): Promise<IUserDTO | null> {
		return await this.findOneByObj({ cpf: login });
	}

	public async createUser(user: IUserRegisterRepository): Promise<IUserDTO> {
		return await new this.userModel(user).save();
	}

	public async updateUser(filter: FilterQuery<IUserDTO>, dataUpdate: UpdateQuery<IUserDTO>): Promise<IUserDTO | null> {
		return await this.userModel.findOneAndUpdate(filter, dataUpdate);
	}
}

export { UserRepository };
