import mongoose from "mongoose";
import { USER_STATUS } from "../constants/USER.ts";

// interface of Data that comes directly to the controller
export interface IUserRegisterDTO {
	full_name: string;
	email: string;
	password: string;
	cpf: string;
	birth_date: string;
	login: string;
}

// interface of Data that return to Client
export interface IUserRegisterReturn {
	id: string;
	login: string;
	first_name: string;
	is_error: false;
	message: "User registered successfully";
}

// interface of Data that save in repository
export interface IUserRegisterRepository {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	cpf: string;
	birth_date: Date;
	login: string;
	status: USER_STATUS;
}

// interface of Data that repository return
export interface IUserRegisterRepositoryReturn extends IUserRegisterRepository {
	_id: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

// interface of filter User by Object
export interface IUserFind {
	id?: string;
	email?: string;
	login?: string;
	cpf?: string;
}

// Interface of Class UserValidations
export interface IUserValidation {
	registerUser(dataValidation: IUserRegisterDTO): Promise<void>;
}

// Interface of Class UserService
export interface IUserService {
	registerUser(dataRegistration: IUserRegisterDTO): Promise<IUserRegisterReturn>;
}

// Interface of Class UserRepository
export interface IUserRepository {
	findOneByObj(filter: IUserFind): Promise<IUserRegisterRepository | null>;
	findUserByEmail(email: string): Promise<IUserRegisterRepository | null>;
	findUserByLogin(login: string): Promise<IUserRegisterRepository | null>;
	findUserByCPF(login: string): Promise<IUserRegisterRepository | null>;
	createUser(user: IUserRegisterRepository): Promise<IUserRegisterRepositoryReturn>;
}
