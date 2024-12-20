import { File } from "formidable";
import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import { USER_STATUS } from "../constants/USER.ts";
import { IDefaultReturnsCreated, IDefaultReturnsSuccess } from "./AppInterface.ts";

export type Roles = "user" | "admin" | "manager" | "editor";

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
	report?: IUserReport;
	current_token?: string;
	avatar?: string;
	avatar_url?: string;
	created_at: Date;
	roles: Roles[];
}

export interface IUserReport {
	total_logins: number;
	last_access: Date;
	first_access: Date;
	total_courses_purchased: number;
	total_courses_launched: number;
	total_courses_completed: number;
}

export interface IUserRegisterRepository extends Omit<Omit<IUserDTO, "created_at">, "roles"> {}

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

export interface IAuthenticate {
	login: string;
	password: string;
}

export interface IGenerateTokenReturn {
	token: string;
	name: string;
	email: string;
	id: string;
	start_session: Date;
	end_session: Date;
}

export interface ITokenCreateDTO {
	sessionId: string;
	userId: string;
	login: string;
}

export interface IAuthenticateReturn extends IGenerateTokenReturn {}

export interface IShowUserReturn {
	id: string;
	full_name: string;
	cpf: string;
	email: string;
	login: string;
	birth_date: Date;
	created_at: Date;
	first_login: Date;
	last_login: Date;
	avatar_url?: string;
	roles?: Roles[];
}

export interface IChangePassword {
	oldPassword: string;
	newPassword: string;
	userId: string;
}

export interface IChangePasswordReturn {}

export interface IUploadAvatar {
	userId: string;
	avatar: File;
}

export interface IUploadAvatarReturn {}

export interface ISetRole {
	userId: string;
	roles: Roles[];
}

export interface ISetRoleReturn {}

export interface IRemoveRole {
	userId: string;
	roles: Roles[];
}

export interface IRemoveRoleReturn {}
export interface ILogoutManyUsersReturn {}

// Interface of Class UserValidations
export interface IUserValidation {
	registerUser(dataValidation: IUserRegisterDTO): Promise<void>;
	requestResetPassword(emailRequester: string): Promise<void>;
	confirmResetPassword(dataConfirmResetPassword: IConfirmResetPassword): Promise<void>;
	authenticate(dataAuthenticate: IAuthenticate): Promise<void>;
	changePassword(dataChangePassword: IChangePassword): Promise<void>;
}

// Interface of Class UserService
export interface IUserService {
	registerUser(
		dataRegistration: IUserRegisterDTO,
	): Promise<IDefaultReturnsCreated<IUserRegisterReturn> | IDefaultReturnsSuccess<IAuthenticateReturn>>;
	requestResetPassword(dataRequestResetPassword: IRequestResetPassword): Promise<IDefaultReturnsSuccess<IUserRequestResetPasswordReturn>>;
	confirmResetPassword(dataConfirmResetPassword: IConfirmResetPassword): Promise<IDefaultReturnsSuccess<IConfirmResetPasswordReturn>>;
	authenticate(dataAuthenticate: IAuthenticate): Promise<IDefaultReturnsSuccess<IAuthenticateReturn>>;
	getUserProfile(userId: string, isAdmin?: boolean): Promise<IDefaultReturnsSuccess<IShowUserReturn>>;
	changePassword(dataChangePassword: IChangePassword): Promise<IDefaultReturnsSuccess<IChangePasswordReturn>>;
	uploadAvatar(dataUploadAvatar: IUploadAvatar): Promise<IDefaultReturnsSuccess<IUploadAvatarReturn>>;
	setRoles(dataSetRole: ISetRole): Promise<IDefaultReturnsSuccess<ISetRoleReturn>>;
	removeRoles(dataSetRole: IRemoveRole): Promise<IDefaultReturnsSuccess<IRemoveRoleReturn>>;
	logoutManyUsers(userIds: string[]): Promise<IDefaultReturnsSuccess<ILogoutManyUsersReturn>>;
}

// Interface of Class UserRepository
export interface IUserRepository {
	findByObj(filter: FilterQuery<IUserDTO>): Promise<IUserDTO[]>;
	findOneByObj(filter: FilterQuery<IUserDTO>): Promise<IUserDTO | null>;
	findUserByEmail(email: string): Promise<IUserDTO | null>;
	findUserById(id: string): Promise<IUserDTO | null>;
	findUserByLogin(login: string): Promise<IUserDTO | null>;
	findUserByCPF(login: string): Promise<IUserDTO | null>;
	createUser(user: IUserRegisterRepository): Promise<IUserDTO>;
	updateUser(filter: FilterQuery<IUserDTO>, dataUpdate: UpdateQuery<IUserDTO>): Promise<IUserDTO | null>;
}
