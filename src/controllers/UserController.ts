import { Request, Response } from "express";
import formidable from "formidable";
import { STATUS_CODES } from "../interfaces/AppInterface.ts";
import {
	IAuthenticate,
	IChangePassword,
	IConfirmResetPassword,
	IRequestResetPassword,
	IUploadAvatar,
	IUserRegisterDTO,
	IUserService,
	Roles,
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
		const dataAuthenticate: IAuthenticate = { login: request.body.login, password: request.body.password, keepLoggedIn: request.body.keep_logged_in };
		const result = await this.userService.authenticate(dataAuthenticate);
		return response.json(result);
	}

	public async showUser(request: Request, response: Response): Promise<Response> {
		const userId = request.user!.id;
		const result = await this.userService.getUserProfile(userId);
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

	public async uploadAvatar(request: Request, response: Response): Promise<Response> {
		return new Promise(resolve => {
			const userId = request.user!.id;

			const form = formidable({ multiples: false });

			form.parse(request, (error, _, files) => {
				if (error) {
					return resolve({ userId, avatar: undefined });
				}

				if (!files || !files.avatar || !files.avatar.length) {
					return resolve({ userId, avatar: undefined });
				}

				return resolve({ userId, avatar: files.avatar[0] });
			});
		}).then(async dataUpload => {
			const result = await this.userService.uploadAvatar(dataUpload as IUploadAvatar);
			return response.json(result);
		});
	}

	public async setRoles(request: Request, response: Response): Promise<Response> {
		const userId = request.params.userId;
		const roles = request.body.roles as Roles[];
		const result = await this.userService.setRoles({ userId, roles });
		return response.json(result);
	}

	public async removeRoles(request: Request, response: Response): Promise<Response> {
		const userId = request.params.userId;
		const roles = request.body.roles as Roles[];
		const result = await this.userService.removeRoles({ userId, roles });
		return response.json(result);
	}

	public async getUserProfile(request: Request, response: Response): Promise<Response> {
		const userId = request.params.userId;
		const isAdmin = request.user?.roles.includes("admin");
		const result = await this.userService.getUserProfile(userId, isAdmin);
		return response.json(result);
	}

	public async logoutManyUsers(request: Request, response: Response): Promise<Response> {
		const userIds = request.body.user_ids;
		const result = await this.userService.logoutManyUsers(userIds);
		return response.json(result);
	}
}

export { UserController };
