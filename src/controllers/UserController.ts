import { Request, Response } from "express";
import { IUserRegisterDTO, IUserService } from "../interfaces/UserInterface.ts";

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
		return response.json(result);
	}

	public async requestResetPassword(request: Request, response: Response): Promise<Response> {
		const emailRequester = request.body.email;
		const result = await this.userService.requestResetPassword(emailRequester);
		return response.json(result);
	}
}

export { UserController };
