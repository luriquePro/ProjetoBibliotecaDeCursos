import moment from "moment";
import {
	IConfirmResetPassword,
	IRequestResetPassword,
	IResetPasswordCode,
	IUserRegisterDTO,
	IUserRegisterRepository,
	IUserRegisterReturn,
	IUserRepository,
	IUserRequestResetPasswordReturn,
	IUserService,
	IUserValidation,
} from "../interfaces/UserInterface.ts";
import { BadRequestError } from "../shared/errors/AppError.ts";
import { HashPassword } from "../utils/HashPassword.ts";
import { IdGenerate } from "../utils/IdGenerate.ts";
import { USER_STATUS } from "../constants/USER.ts";
import { IRedisRepository } from "../interfaces/RedisRepository.ts";

class UserService implements IUserService {
	constructor(
		private readonly userValidations: IUserValidation,
		private readonly userRepository: IUserRepository,
		private readonly redisRepository: IRedisRepository,
	) {}

	public async registerUser({ full_name, email, password, cpf, birth_date, login }: IUserRegisterDTO): Promise<IUserRegisterReturn> {
		const dataValidation = { full_name, email, password, cpf, birth_date, login };
		await this.userValidations.registerUser(dataValidation);

		// Check if CPF is unique
		const userExistsWithSameCpf = await this.userRepository.findUserByCPF(cpf);
		if (userExistsWithSameCpf) {
			throw new BadRequestError("User already exists with this CPF");
		}

		// Check if email is unique
		const userExistsWithSameEmail = await this.userRepository.findUserByEmail(email);
		if (userExistsWithSameEmail) {
			throw new BadRequestError("User already exists with this email");
		}

		// Check if login is unique
		const userExistsWithSameLogin = await this.userRepository.findUserByLogin(login);
		if (userExistsWithSameLogin) {
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
			is_error: false,
			message: "User registered successfully",
			status_code: 201,
		};

		return returnData;
	}

	public async requestResetPassword({ email: emailRequester }: IRequestResetPassword): Promise<IUserRequestResetPasswordReturn> {
		// Validate email
		await this.userValidations.requestResetPassword(emailRequester);

		// Check if email exists
		const userWithEmailExists = await this.userRepository.findUserByEmail(emailRequester);
		if (!userWithEmailExists) {
			throw new BadRequestError("This email is not being used, please enter a valid email address");
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
		const returnData: IUserRequestResetPasswordReturn = {
			is_error: false,
			message: "Reset code sent successfully",
			status_code: 200,
			reset_code: resetCode.code,
		};

		return returnData;
	}

	public async confirmResetPassword({ code, password }: IConfirmResetPassword): Promise<string> {
		// Validate reset code
		await this.userValidations.confirmResetPassword({ code, password });

		// Check if reset code exists
		const resetCodeExists = await this.redisRepository.getResetPasswordCode(code);
		if (!resetCodeExists) {
			throw new BadRequestError("Invalid reset code");
		}

		// Receber a senha e validar
		return "";
	}
}

export { UserService };
