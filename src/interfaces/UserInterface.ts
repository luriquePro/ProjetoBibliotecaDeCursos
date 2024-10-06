import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import { USER_STATUS } from "../constants/USER.ts";
import { IDefaultReturnsCreated, IDefaultReturnsSuccess } from "./AppInterface.ts";

/* 
	#Register
*/

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
}

// interface of Data that save in repository

export interface IUserDTO {
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

export interface IUserRegisterRepository extends IUserDTO {}

// interface of Data that repository return
export interface IUserRegisterRepositoryReturn extends IUserDTO {
	_id: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

/*
	#Reset Password
*/

export interface IRequestResetPassword {
	email: string;
}

// Interface of data saved in Redis
export interface IResetPasswordCode {
	code: string;
	limit_datetime: string;
	user_id: string;
	email: string;
}

export interface IUserRequestResetPasswordReturn {
	reset_code: string;
}

export interface IConfirmResetPassword {
	password: string;
	code: string;
}

export interface IConfirmResetPasswordReturn {
	logout: true;
}

// Interface of Class UserValidations
export interface IUserValidation {
	registerUser(dataValidation: IUserRegisterDTO): Promise<void>;
	requestResetPassword(emailRequester: string): Promise<void>;
	confirmResetPassword(dataConfirmResetPassword: IConfirmResetPassword): Promise<void>;
}

// Interface of Class UserService
export interface IUserService {
	registerUser(dataRegistration: IUserRegisterDTO): Promise<IDefaultReturnsCreated<IUserRegisterReturn>>;
	requestResetPassword(dataRequestResetPassword: IRequestResetPassword): Promise<IDefaultReturnsSuccess<IUserRequestResetPasswordReturn>>;
	confirmResetPassword(dataConfirmResetPassword: IConfirmResetPassword): Promise<IDefaultReturnsSuccess<IConfirmResetPasswordReturn>>;
}

// Interface of Class UserRepository
export interface IUserRepository {
	findOneByObj(filter: FilterQuery<IUserDTO>): Promise<IUserDTO | null>;
	findUserByEmail(email: string): Promise<IUserDTO | null>;
	findUserById(id: string): Promise<IUserDTO | null>;
	findUserByLogin(login: string): Promise<IUserDTO | null>;
	findUserByCPF(login: string): Promise<IUserDTO | null>;
	createUser(user: IUserRegisterRepository): Promise<IUserDTO>;
	updateUser(filter: FilterQuery<IUserDTO>, dataUpdate: UpdateQuery<IUserDTO>): Promise<IUserDTO | null>;
}
