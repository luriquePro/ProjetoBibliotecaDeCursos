import { Model } from "mongoose";

import { IUserDTO, IUserFind, IUserRegisterRepository, IUserRepository } from "../interfaces/UserInterface.ts";
import { IUserMongo } from "../models/User.ts";

class UserRepository implements IUserRepository {
	constructor(private readonly userModel: Model<IUserMongo>) {}
	public async findOneByObj(filter: IUserFind): Promise<IUserDTO | null> {
		const result = await this.userModel.findOne(filter);
		return result;
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
		const result = await new this.userModel(user).save();
		return result;
	}
}

export { UserRepository };
