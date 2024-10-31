import { Request, Response } from "express";
import { STATUS_CODES } from "../interfaces/AppInterface.ts";
import {
	IAuthenticate,
	IChangePassword,
	IConfirmResetPassword,
	IRequestResetPassword,
	IUserRegisterDTO,
	IUserService,
} from "../interfaces/UserInterface.ts";

class UserController {
	constructor(private readonly userService: IUserService) {}

	public async registerUser(request: Request, response: Response): Promise<Response> {
		const dataRegistration: IUserRegisterDTO = {
			full_name: request.body.full_name,
			email: request.body.email,
			password: request.body.password,
			cpf: request.body.cpf,
			birth_date: request.body.birth_date,
			login: request.body.login,
		};

		const result = await this.userService.registerUser(dataRegistration);
		return response.status(STATUS_CODES.CREATED).json(result);
	}

	public async requestResetPassword(request: Request, response: Response): Promise<Response> {
		const dataRequestResetPassword: IRequestResetPassword = { email: request.body.email };
		const result = await this.userService.requestResetPassword(dataRequestResetPassword);
		return response.json(result);
	}

	public async confirmResetPassword(request: Request, response: Response): Promise<Response> {
		const dataConfirmResetPassword: IConfirmResetPassword = { code: request.body.reset_password_code, password: request.body.new_password };
		const result = await this.userService.confirmResetPassword(dataConfirmResetPassword);
		return response.json(result);
	}

	public async authenticate(request: Request, response: Response): Promise<Response> {
		const dataAuthenticate: IAuthenticate = { login: request.body.login, password: request.body.password };
		const result = await this.userService.authenticate(dataAuthenticate);
		return response.json(result);
	}

	public async showUser(request: Request, response: Response): Promise<Response> {
		const userId = request.user!.id;
		const result = await this.userService.showUser(userId);
		return response.json(result);
	}

	public async changePassword(request: Request, response: Response): Promise<Response> {
		const dataChangePassword: IChangePassword = {
			newPassword: request.body.new_password,
			oldPassword: request.body.old_password,
			userId: request.user!.id,
		};

		const result = await this.userService.changePassword(dataChangePassword);
		return response.json(result);
	}
}

export { UserController };
