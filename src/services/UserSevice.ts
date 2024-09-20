import moment from "moment";
import {
	IUserRegisterDTO,
	IUserRegisterRepository,
	IUserRegisterReturn,
	IUserRepository,
	IUserService,
	IUserValidation,
} from "../interfaces/UserInterface.ts";
import { BadRequestError } from "../shared/errors/AppError.ts";
import { HashPassword } from "../utils/HashPassword.ts";
import { IdGenerate } from "../utils/IdGenerate.ts";
import { USER_STATUS } from "../constants/USER.ts";

class UserService implements IUserService {
	constructor(
		private readonly userValidations: IUserValidation,
		private readonly userRepository: IUserRepository,
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
}

export { UserService };
