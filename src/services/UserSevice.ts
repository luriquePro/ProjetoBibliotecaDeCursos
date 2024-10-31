import moment from "moment";
import { USER_STATUS } from "../constants/USER.ts";
import { IDefaultReturnsCreated, IDefaultReturnsSuccess } from "../interfaces/AppInterface.ts";
import { IConfiguresService } from "../interfaces/ConfigureInterface.ts";
import { IRedisRepository } from "../interfaces/RedisRepository.ts";
import { ISessionService } from "../interfaces/SessionInterface.ts";
import {
	IAuthenticate,
	IAuthenticateReturn,
	IConfirmResetPassword,
	IConfirmResetPasswordReturn,
	IRequestResetPassword,
	IResetPasswordCode,
	IShowUserReturn,
	IUserRegisterDTO,
	IUserRegisterRepository,
	IUserRegisterReturn,
	IUserReport,
	IUserRepository,
	IUserRequestResetPasswordReturn,
	IUserService,
	IUserValidation,
} from "../interfaces/UserInterface.ts";
import { DefaultReturns } from "../shared/DefaultReturns.ts";
import { BadRequestError, NotFoundError } from "../shared/errors/AppError.ts";
import { Logger } from "../shared/Logger.ts";
import { GenerateToken } from "../utils/GenerateToken.ts";
import { HashPassword } from "../utils/HashPassword.ts";
import { IdGenerate } from "../utils/IdGenerate.ts";

class UserService implements IUserService {
	constructor(
		private readonly userValidations: IUserValidation,
		private readonly userRepository: IUserRepository,
		private readonly redisRepository: IRedisRepository,
		private readonly sessionService: ISessionService,
		private readonly configuresService: IConfiguresService,
		private readonly logger = new Logger("user"),
	) {}

	public async registerUser({
		full_name,
		email,
		password,
		cpf,
		birth_date,
		login,
	}: IUserRegisterDTO): Promise<IDefaultReturnsCreated<IUserRegisterReturn> | IDefaultReturnsSuccess<IAuthenticateReturn>> {
		const dataValidation = { full_name, email, password, cpf, birth_date, login };
		await this.userValidations.registerUser(dataValidation);

		// Check if CPF is unique
		const userExistsWithSameCpf = await this.userRepository.findUserByCPF(cpf);
		if (userExistsWithSameCpf) {
			await this.logger.error({
				entityId: userExistsWithSameCpf.id,
				statusCode: 400,
				title: "User already exists with this CPF",
				description: "Send a new request to register a new user With the same CPF already exists",
			});

			throw new BadRequestError("User already exists with this CPF");
		}

		// Check if email is unique
		const userExistsWithSameEmail = await this.userRepository.findUserByEmail(email);
		if (userExistsWithSameEmail) {
			await this.logger.error({
				entityId: userExistsWithSameEmail.id,
				statusCode: 400,
				title: "User already exists with this email",
				description: "Send a new request to register a new user With the same email already exists",
			});

			throw new BadRequestError("User already exists with this email");
		}

		// Check if login is unique
		const userExistsWithSameLogin = await this.userRepository.findUserByLogin(login);
		if (userExistsWithSameLogin) {
			await this.logger.error({
				entityId: userExistsWithSameLogin.id,
				statusCode: 400,
				title: "User already exists with this login",
				description: "Send a new request to register a new user With the same login already exists",
			});

			throw new BadRequestError("User already exists with this login");
		}

		// Hash password
		const hashedPassword = HashPassword(password);

		// Divide full name
		const [firstName, ...lastName] = full_name.split(" ");

		// Build User Object
		const userCreate: IUserRegisterRepository = {
			id: IdGenerate(),
			first_name: firstName,
			last_name: lastName.join(" "),
			password: hashedPassword,
			email,
			cpf,
			birth_date: moment(birth_date).toDate(),
			login,
			status: USER_STATUS.ACTIVE,
		};

		// Save User
		const result = await this.userRepository.createUser(userCreate);

		// Data Return to Client
		const returnData: IUserRegisterReturn = {
			id: result.id,
			login: result.login,
			first_name: result.first_name,
		};

		await this.logger.info({
			entityId: returnData.id,
			title: "User registered successfully",
			description: `User ${result.login} registered successfully`,
			statusCode: 201,
			objectData: returnData,
		});

		const doAuthenticateWhenRegistering = await this.configuresService.getConfigure("do_authenticate_when_registering");
		if (doAuthenticateWhenRegistering) {
			return await this.authenticate({ login, password });
		}

		return DefaultReturns.created({ message: "User registered successfully", body: returnData });
	}

	public async requestResetPassword({
		email: emailRequester,
	}: IRequestResetPassword): Promise<IDefaultReturnsSuccess<IUserRequestResetPasswordReturn>> {
		// Validate email
		await this.userValidations.requestResetPassword(emailRequester);

		// Check if email exists
		const userWithEmailExists = await this.userRepository.findUserByEmail(emailRequester);
		if (!userWithEmailExists) {
			await this.logger.error({
				entityId: "NE",
				statusCode: 400,
				title: "This email is not being used",
				description: "Send a new request to reset the password with email not being used",
			});

			throw new BadRequestError("This email is not being used, please enter a valid email address");
		}

		// Check if user is active
		if (userWithEmailExists.status !== USER_STATUS.ACTIVE) {
			await this.logger.error({
				entityId: userWithEmailExists.id,
				statusCode: 400,
				title: "This user is not active",
				description: "Send a new request to reset the password with an inactive user",
			});

			throw new BadRequestError("This user is not active, please contact your administrator");
		}

		// Check if user just have a code
		const resetCodeExists = await this.redisRepository.getResetPasswordCode(emailRequester);
		if (resetCodeExists) {
			await this.logger.error({
				entityId: userWithEmailExists.id,
				statusCode: 400,
				title: "You already have a reset code",
				description: "Send a new request to reset the password with a code already being used",
			});

			throw new BadRequestError("You already have a reset code, please check your email");
		}

		// Generate a reset password code
		const resetPasswordCode = IdGenerate();

		// Create a resetCode object
		const resetCode: IResetPasswordCode = {
			user_id: userWithEmailExists.id,
			email: emailRequester,
			code: resetPasswordCode,
			limit_datetime: moment().utc().add(5, "minutes").toISOString(),
		};

		// Save reset password code
		await this.redisRepository.saveResetPasswordCode(resetCode, 5 * 60);

		// Data Return to Client
		const returnData: IUserRequestResetPasswordReturn = { reset_code: resetCode.code };

		await this.logger.info({
			entityId: userWithEmailExists.id,
			title: "Reset code sent successfully",
			description: `Reset code sent successfully to ${userWithEmailExists.login}`,
			statusCode: 200,
			objectData: returnData,
		});

		return DefaultReturns.success({ message: "Reset code sent successfully", body: returnData });
	}

	public async confirmResetPassword({ code, password }: IConfirmResetPassword): Promise<IDefaultReturnsSuccess<IConfirmResetPasswordReturn>> {
		// Validate reset code
		await this.userValidations.confirmResetPassword({ code, password });

		// Check if reset code exists
		const resetCodeExists = await this.redisRepository.getResetPasswordCode(code);
		if (!resetCodeExists) {
			await this.logger.error({
				entityId: "NE",
				statusCode: 400,
				title: "Invalid code",
				description: "Send a new request to Confirm reset password with an invalid code",
			});

			throw new BadRequestError("Invalid code");
		}

		// Check if this code is expired
		if (moment().utc().isAfter(moment(resetCodeExists.limit_datetime))) {
			await this.logger.error({
				entityId: "NE",
				statusCode: 400,
				title: "Code expired",
				description: "Send a new request to Confirm reset password with an expired code",
			});

			throw new BadRequestError("Code expired");
		}

		// Check if user exists
		const userExists = await this.userRepository.findUserById(resetCodeExists.user_id);
		if (!userExists) {
			await this.logger.error({
				entityId: "NE",
				statusCode: 400,
				title: "User does not Exists",
				description: "Send a new request to Confirm reset password with an invalid user",
			});

			throw new BadRequestError("User does not Exists");
		}

		// Check if User is active
		if (userExists.status !== USER_STATUS.ACTIVE) {
			await this.logger.error({
				entityId: userExists.id,
				statusCode: 400,
				title: "User is not active",
				description: "Send a new request to Confirm reset password with an inactive user",
			});

			throw new BadRequestError("User is not active");
		}

		// Hash password
		const hashedPassword = HashPassword(password);

		// Update User
		await this.userRepository.updateUser({ id: userExists.id }, { $set: { password: hashedPassword } });

		// Data Return to Client
		const returnData: IConfirmResetPasswordReturn = { logout: true };

		await this.logger.info({
			entityId: userExists.id,
			title: "Password changed successfully",
			description: `Password changed successfully to ${userExists.login}`,
			statusCode: 200,
			objectData: returnData,
		});

		return DefaultReturns.success({ message: "Password changed successfully", body: returnData });
	}

	public async authenticate({ login, password }: IAuthenticate): Promise<IDefaultReturnsSuccess<IAuthenticateReturn>> {
		await this.userValidations.authenticate({ login, password });

		const userWithThisLogin = await this.userRepository.findOneByObj({ $or: [{ login }, { email: login }, { cpf: login }] });
		if (!userWithThisLogin) {
			await this.logger.error({
				entityId: "NE",
				statusCode: 400,
				title: "User with this login does not Exists",
				description: "Send a new request to authenticate with an invalid login",
				objectData: { login },
			});

			throw new NotFoundError("User does not Exists, check your login or register a new user");
		}

		const hashedPassword = HashPassword(password);

		// Check this way to avoid having contact with the user's hashed password.
		// In the future, the password will already be hashed from the frontend.
		const userWithThisLoginAndPassword = await this.userRepository.findOneByObj({ id: userWithThisLogin.id, password: hashedPassword });
		if (!userWithThisLoginAndPassword) {
			await this.logger.error({
				entityId: userWithThisLogin.id,
				statusCode: 400,
				title: "Invalid password",
				description: "Send a new request to authenticate with an invalid password",
				objectData: { login, password },
			});

			throw new BadRequestError("Invalid password");
		}

		const reportUpdate: Partial<IUserReport> = {
			...userWithThisLoginAndPassword.report,
			last_access: moment().utc().toDate(),
			total_logins: userWithThisLoginAndPassword.report!.total_logins + 1,
		};

		const hasSessionOpened = await this.sessionService.getUserOpenSession(userWithThisLoginAndPassword.id);
		if (hasSessionOpened) {
			const returnData = GenerateToken(userWithThisLoginAndPassword, hasSessionOpened);
			if (returnData.token === userWithThisLogin.current_token) {
				await this.logger.info({
					entityId: userWithThisLoginAndPassword.id,
					title: "Login successfully with session open",
					description: `Login successfully to ${userWithThisLoginAndPassword.login}`,
					statusCode: 200,
					objectData: returnData,
				});

				await this.userRepository.updateUser({ id: userWithThisLoginAndPassword.id }, { $set: { report: reportUpdate } });
				return DefaultReturns.success({ message: "Login successfully", body: returnData });
			}
		}

		await this.sessionService.inactivateAllUserSessions(userWithThisLoginAndPassword.id);

		const newSession = await this.sessionService.createUserSession(userWithThisLoginAndPassword.id);
		const returnData = GenerateToken(userWithThisLoginAndPassword, newSession);

		await this.logger.info({
			entityId: userWithThisLoginAndPassword.id,
			title: "Login successfully with new session",
			description: `Login successfully to ${userWithThisLoginAndPassword.login}`,
			statusCode: 200,
			objectData: returnData,
		});

		if (!userWithThisLoginAndPassword.report!.first_access) {
			reportUpdate.first_access = moment().utc().toDate();
		}

		await this.userRepository.updateUser(
			{ id: userWithThisLoginAndPassword.id },
			{ $set: { report: reportUpdate, current_token: returnData.token } },
		);
		return DefaultReturns.success({ message: "Login successfully", body: returnData });
	}

	public async showUser(userId: string): Promise<IDefaultReturnsSuccess<IShowUserReturn>> {
		const showUserCached = await this.redisRepository.getShowUserCache(userId);
		if (showUserCached) {
			await this.logger.info({
				entityId: userId,
				title: "Show user successfully",
				description: `Show user successfully to ${userId}`,
				statusCode: 200,
				objectData: showUserCached,
			});

			return DefaultReturns.success({ message: "Show user successfully", body: showUserCached });
		}

		const userWithThisId = await this.userRepository.findUserById(userId);
		if (!userWithThisId) {
			await this.logger.error({
				entityId: "NE",
				statusCode: 400,
				title: "User with this id does not Exists",
				description: "Send a new request to show an invalid user",
				objectData: { userId },
			});

			throw new NotFoundError("User does not Exists");
		}

		const returnData: IShowUserReturn = {
			full_name: userWithThisId.first_name + " " + userWithThisId.last_name,
			login: userWithThisId.login,
			email: userWithThisId.email,
			cpf: userWithThisId.cpf,
			created_at: userWithThisId.created_at,
			birth_date: userWithThisId.birth_date,
			first_login: userWithThisId.report!.first_access,
			last_login: userWithThisId.report!.last_access,
		};

		await this.logger.info({
			entityId: userWithThisId.id,
			title: "Show user successfully",
			description: `Show user successfully to ${userWithThisId.login}`,
			statusCode: 200,
			objectData: returnData,
		});

		await this.redisRepository.saveShowUserCache(userId, returnData);
		return DefaultReturns.success({ message: "Show user successfully", body: returnData });
	}
}

export { UserService };
