import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import moment from "moment";
import { USER_STATUS } from "../../constants/USER.ts";
import { IRedisRepository } from "../../interfaces/RedisRepository.ts";
import {
	IConfirmResetPassword,
	IUserRegisterDTO,
	IUserRegisterReturn,
	IUserRepository,
	IUserService,
	IUserValidation,
} from "../../interfaces/UserInterface.ts";
import { client } from "../../models/Redis.ts";
import { UserModel } from "../../models/User.ts";
import { RedisRepository } from "../../repositories/RedisRepository.ts";
import { UserRepository } from "../../repositories/UserRepository.ts";
import { UserService } from "../../services/UserSevice.ts";
import { UserValidations } from "../../validations/UserValidations.ts";

describe("#UserService Suite", () => {
	let userService: IUserService;
	let userMocked: IUserRegisterDTO;
	let userValidation: IUserValidation;
	let userRepository: IUserRepository;
	let redisRepository: IRedisRepository;

	beforeEach(() => {
		userValidation = new UserValidations();
		userRepository = new UserRepository(UserModel);
		redisRepository = new RedisRepository(client);

		userService = new UserService(userValidation, userRepository, redisRepository);
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	describe("#Register", () => {
		beforeEach(() => {
			userMocked = {
				full_name: "Valid Full Name",
				login: "ValidLo123",
				email: "ValidEmail@test.com",
				cpf: "12345678909",
				password: "ValidPass123!@",
				birth_date: "2004-01-01T03:00:00.000Z",
			};

			jest.spyOn(userValidation, userValidation.registerUser.name as any).mockReturnValue(undefined);
		});

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
			expect(result).toEqual({ is_error: false, message: "User registered successfully", status_code: 201, body: expected });
		});
	});

	describe("#Request Reset Password", () => {
		beforeEach(() => {
			jest.spyOn(userValidation, userValidation.requestResetPassword.name as any).mockReturnValue(undefined);
		});

		test("Should throw an error if email isn't use", async () => {
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue(undefined);
			jest.spyOn(redisRepository, redisRepository.saveResetPasswordCode.name as any).mockReturnValue(undefined);

			expect(userService.requestResetPassword(userMocked)).rejects.toThrow("This email is not being used, please enter a valid email address");
		});

		test("Should throw an error if user status is not active", async () => {
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue({ ...userMocked, status: USER_STATUS.DELETED });

			expect(userService.requestResetPassword(userMocked)).rejects.toThrow("This user is not active, please contact your administrator");
		});

		test("Should throw an error if user just have a code", async () => {
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue({ ...userMocked, status: USER_STATUS.ACTIVE });
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue({ code: "VALIDCODE" });

			expect(userService.requestResetPassword(userMocked)).rejects.toThrow("You already have a reset code, please check your email");
		});

		test("Should not throw an error if email is use", async () => {
			jest.spyOn(userRepository, userRepository.findUserByEmail.name as any).mockReturnValue({ ...userMocked, status: USER_STATUS.ACTIVE });
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue(null);

			await expect(userService.requestResetPassword(userMocked)).resolves.not.toThrow();
		});
	});

	describe("#Reset Password", () => {
		const confirmMocked: IConfirmResetPassword = {
			code: "VALIDCODE",
			password: "Vpass123!@",
		};

		beforeEach(() => {
			jest.spyOn(userValidation, userValidation.confirmResetPassword.name as any).mockReturnValue(undefined);
		});

		test("Should throw an error if code does not exists", async () => {
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue(undefined);
			expect(userService.confirmResetPassword(confirmMocked)).rejects.toThrow("Invalid code");

			expect(redisRepository.getResetPasswordCode).toHaveBeenCalledTimes(0);
		});

		test("Should throw an error if code is expired", async () => {
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue({
				code: confirmMocked.code,
				email: "VALIDEMAIL",
				limit_datetime: moment().utc().subtract(5, "minutes").toDate(),
				user_id: "VALIDUSERID",
			});

			expect(userService.confirmResetPassword(confirmMocked)).rejects.toThrow("Code expired");
		});

		test("Should throw an error if user does not exists", async () => {
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue({
				code: confirmMocked.code,
				email: "VALIDEMAIL",
				limit_datetime: moment().utc().add(5, "minutes").toDate(),
				user_id: "VALIDUSERID",
			});

			jest.spyOn(userRepository, userRepository.findUserById.name as any).mockReturnValue(undefined);

			expect(userService.confirmResetPassword(confirmMocked)).rejects.toThrow("User does not Exists");
		});

		test("Should throw an error if user status is not active", async () => {
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue({
				code: confirmMocked.code,
				email: "VALIDEMAIL",
				limit_datetime: moment().utc().add(5, "minutes").toDate(),
				user_id: "VALIDUSERID",
			});

			jest.spyOn(userRepository, userRepository.findUserById.name as any).mockReturnValue({
				...userMocked,
				status: USER_STATUS.DELETED,
			});

			expect(userService.confirmResetPassword(confirmMocked)).rejects.toThrow("User is not active");
		});

		test("Should not throw an error if user status is active", async () => {
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue({
				code: confirmMocked.code,
				email: "VALIDEMAIL",
				limit_datetime: moment().utc().add(5, "minutes").toDate(),
				user_id: "VALIDUSERID",
			});

			jest.spyOn(userRepository, userRepository.findUserById.name as any).mockReturnValue({
				...userMocked,
				status: USER_STATUS.ACTIVE,
			});

			jest.spyOn(userRepository, userRepository.updateUser.name as any).mockReturnValue({
				...userMocked,
				status: USER_STATUS.ACTIVE,
			});

			await expect(userService.confirmResetPassword(confirmMocked)).resolves.not.toThrow();
		});

		test("Should not throw an error if code exists", async () => {
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue({
				code: confirmMocked.code,
				email: "VALIDEMAIL",
				limit_datetime: moment().utc().add(5, "minutes").toDate(),
				user_id: "VALIDUSERID",
			});

			jest.spyOn(userRepository, userRepository.findUserById.name as any).mockReturnValue({
				...userMocked,
				status: USER_STATUS.ACTIVE,
			});

			jest.spyOn(userRepository, userRepository.updateUser.name as any).mockReturnValue({
				...userMocked,
				status: USER_STATUS.ACTIVE,
			});

			await expect(userService.confirmResetPassword(confirmMocked)).resolves.not.toThrow();
		});

		test("Should not throw an error if user exists", async () => {
			jest.spyOn(redisRepository, redisRepository.getResetPasswordCode.name as any).mockReturnValue({
				code: confirmMocked.code,
				email: "VALIDEMAIL",
				limit_datetime: moment().utc().add(5, "minutes").toDate(),
				user_id: "VALIDUSERID",
			});

			jest.spyOn(userRepository, userRepository.findUserById.name as any).mockReturnValue({
				...userMocked,
				status: USER_STATUS.ACTIVE,
			});

			jest.spyOn(userRepository, userRepository.updateUser.name as any).mockReturnValue({
				...userMocked,
				status: USER_STATUS.ACTIVE,
			});

			await expect(userService.confirmResetPassword(confirmMocked)).resolves.not.toThrow();
		});
	});
});
