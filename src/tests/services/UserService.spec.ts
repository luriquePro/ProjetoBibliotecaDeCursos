import { describe, test, jest, afterEach, beforeEach, expect } from "@jest/globals";
import { IUserRegisterDTO, IUserRegisterReturn, IUserRepository, IUserService, IUserValidation } from "../../interfaces/UserInterface.ts";
import { UserService } from "../../services/UserSevice.ts";
import { UserValidations } from "../../validations/UserValidations.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";
import { UserModel } from "../../models/User.ts";

describe("#UserService Suite", () => {
	let userService: IUserService;
	let userMocked: IUserRegisterDTO;
	let userValidation: IUserValidation;
	let userRepository: IUserRepository;

	beforeEach(() => {
		userValidation = new UserValidations();
		userRepository = new UserRepository(UserModel);

		userMocked = {
			full_name: "Valid Full Name",
			login: "ValidLo123",
			email: "ValidEmail@test.com",
			cpf: "12345678909",
			password: "ValidPass123!@",
			birth_date: "2004-01-01T03:00:00.000Z",
		};

		jest.spyOn(userValidation, userValidation.registerUser.name as any).mockReturnValue(undefined);

		userService = new UserService(userValidation, userRepository);
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe("#Register", () => {
		test("Should throw an error if CPF already exists", async () => {
			jest.spyOn(userRepository, userRepository.findUserByCPF.name as any).mockReturnValue(userMocked);
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue(undefined);
			jest.spyOn(userRepository, userRepository.findUserByLogin.name as any).mockReturnValue(undefined);

			expect(userService.registerUser(userMocked)).rejects.toThrow("User already exists with this CPF");
		});

		test("Should throw an error if email already exists", async () => {
			// Arrange
			jest.spyOn(userRepository, userRepository.findUserByCPF.name as any).mockReturnValue(undefined);
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue(userMocked);
			jest.spyOn(userRepository, userRepository.findUserByLogin.name as any).mockReturnValue(undefined);

			expect(userService.registerUser(userMocked)).rejects.toThrow("User already exists with this email");
		});

		test("Should throw an error if login already exists", async () => {
			// Arrange
			jest.spyOn(userRepository, userRepository.findUserByCPF.name as any).mockReturnValue(undefined);
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue(undefined);
			jest.spyOn(userRepository, userRepository.findUserByLogin.name as any).mockReturnValue(userMocked);

			expect(userService.registerUser(userMocked)).rejects.toThrow("User already exists with this login");
		});

		test("Should be able to register a new user", async () => {
			// Arrange
			const [firstName] = userMocked.full_name.split(" ");

			const expected: IUserRegisterReturn = {
				id: "aaa",
				login: userMocked.login,
				first_name: firstName,
				is_error: false,
				message: "User registered successfully",
				status_code: 201,
			};

			jest.spyOn(userRepository, userRepository.findUserByCPF.name as any).mockReturnValue(undefined);
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue(undefined);
			jest.spyOn(userRepository, userRepository.findUserByLogin.name as any).mockReturnValue(undefined);
			jest
				.spyOn(userRepository, userRepository.createUser.name as any)
				.mockReturnValue(expected)
				.mockImplementation(() => expected);

			// Act
			const result = await userService.registerUser(userMocked);

			// Assert
			expect(result).toEqual(expected);
		});
	});
});
