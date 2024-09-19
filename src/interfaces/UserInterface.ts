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

// Interface of Class UserValidations
export interface IUserValidation {
	registerUser(dataValidation: IUserRegisterDTO): Promise<void>;
}
