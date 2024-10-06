import { describe, test, jest, afterEach, beforeEach, expect } from "@jest/globals";
import { IUserRegisterDTO, IUserValidation } from "../../interfaces/UserInterface.ts";
import { UserValidations } from "../../validations/UserValidations.ts";

describe("#UserValidator Suite", () => {
	let userValidations: IUserValidation;

	beforeEach(() => {
		userValidations = new UserValidations();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("#Register", () => {
		let dataUserRegistration: IUserRegisterDTO;

		beforeEach(() => {
			dataUserRegistration = {
				full_name: "Valid Full Name",
				login: "ValidLo123",
				email: "ValidEmail@test.com",
				cpf: "12345678909",
				password: "ValidPass123!@",
				birth_date: "2004-01-01T03:00:00.000Z",
			};

			jest.spyOn(Date.prototype, Date.prototype.toISOString.name as any).mockReturnValue("2024-09-19T03:00:00.000Z");
		});

		describe("#FullName Field Validation", () => {
			test("Should throw an error if full name is empty", async () => {
				const dataUserMocked = { ...dataUserRegistration, full_name: "" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Full name is a required field"));
			});

			test("Should throw an error if full name has less than 6 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, full_name: "Name" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Enter your full name"));
			});

			test("Should throw an error if full name has more than 50 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, full_name: "VALID NAME WITH MORE THAN FIFTY CHARACTERES IN VALIDATION REGISTRATION USER" };

				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("The full name can only contain up to 50 characters"));
			});

			test("Should thow an erro if `Last_name` does not exists", async () => {
				const dataUserMocked = { ...dataUserRegistration, full_name: "VALIDFIRSTNAME" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Last Name is required"));
			});

			test("Should throw an error if full name isn't a string", async () => {
				const dataUserMocked = { ...dataUserRegistration, full_name: "123456789 INVALID_FULL_NAME" };

				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Full name field can only contain letters and spaces"));
			});

			test("Should not throw an error if full name is valid", async () => {
				await expect(userValidations.registerUser(dataUserRegistration)).resolves.not.toThrow();
			});
		});

		describe("#Login Field Validation", () => {
			test("Should throw an error if login is empty", async () => {
				const dataUserMocked = { ...dataUserRegistration, login: "" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Login is a required field"));
			});

			test("Should throw an error if login has less than 6 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, login: "Login" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Login must contain at least 6 characters"));
			});

			test("Should throw an error if login has more than 16 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, login: "VALIDLOGINWITHMORETHANSIXTEENCHARACTERES" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("The login can only contain up to 16 characters"));
			});

			test("Should throw an error if login has special characters", async () => {
				const dataUserMocked = { ...dataUserRegistration, login: "VALI @1" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(
					new Error("Login field can only contain letters, numbers and spaces"),
				);
			});

			test("Should throw an error if login is in email format", async () => {
				const dataUserMocked = { ...dataUserRegistration, login: "LOGIN@EMAIL.COM" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Login cannot be in email format"));
			});

			test("Should throw an error if login does not have a letter", async () => {
				const dataUserMocked = { ...dataUserRegistration, login: "123456789" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Login must contain at least one letter"));
			});

			test("Should not throw an error if login is valid", async () => {
				await expect(userValidations.registerUser(dataUserRegistration)).resolves.not.toThrow();
			});
		});

		describe("#Email Field Validation", () => {
			test("Should throw an error if email is empty", async () => {
				const dataUserMocked = { ...dataUserRegistration, email: "" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Email is a required field"));
			});

			test("Should throw an error if email isn't valid ", async () => {
				const dataUserMocked = { ...dataUserRegistration, email: "INVALIDEMAIL" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Enter a valid email"));
			});

			test("Should not throw an error if email is valid", async () => {
				await expect(userValidations.registerUser(dataUserRegistration)).resolves.not.toThrow();
			});
		});

		describe("#CPF Field Validation", () => {
			test("Should throw an error if cpf is empty", async () => {
				const dataUserMocked = { ...dataUserRegistration, cpf: "" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Cpf is a required field"));
			});

			test("Should throw an error if cpf isn't valid ", async () => {
				const dataUserMocked = { ...dataUserRegistration, cpf: "INVALIDCPF1" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Cpf can only contain numbers"));
			});

			test("Should throw an error if cpf isn't valid ", async () => {
				const dataUserMocked = { ...dataUserRegistration, cpf: "12345678901" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Cpf is invalid"));
			});

			test("Should throw an error if cpf has less than 11 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, cpf: "1234567890" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Cpf must contain 11 digits"));
			});

			test("Should throw an error if cpf has more than 11 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, cpf: "1234567891011" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Cpf must contain 11 digits"));
			});

			test("Should throw an error if cpf has more than 11 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, cpf: "123.456.789-10" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Cpf must contain 11 digits"));
			});

			test("Should throw an error if cpf has special characters", async () => {
				const dataUserMocked = { ...dataUserRegistration, cpf: "123.456.78-" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Cpf can only contain numbers"));
			});

			test("Should not throw an error if cpf is valid", async () => {
				await expect(userValidations.registerUser(dataUserRegistration)).resolves.not.toThrow();
			});
		});

		describe("#Password Field Validation", () => {
			test("Should throw an error if password is empty", async () => {
				const dataUserMocked = { ...dataUserRegistration, password: "" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Password is a required field"));
			});

			test("Should throw an error if password has less than 8 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, password: "1234567" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Password must contain at least 8 characters"));
			});

			test("Should throw an error if password has more than 16 characters ", async () => {
				const dataUserMocked = { ...dataUserRegistration, password: "VALIDPASSWORDWITHMORETHANSIXTEENCHARACTERES" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("The password can only contain up to 16 characters"));
			});

			test("Should throw an error if password does not have at least one letter", async () => {
				const dataUserMocked = { ...dataUserRegistration, password: "12345678" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Password must contain at least one letter"));
			});

			test("Should throw an error if password does not have at least one number", async () => {
				const dataUserMocked = { ...dataUserRegistration, password: "abcdefghi" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Password must contain at least one number"));
			});

			test("Should throw an error if password does not have at least one special character", async () => {
				const dataUserMocked = { ...dataUserRegistration, password: "abc45678" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Password must contain at least one special character"));
			});

			test("Should not throw an error if password is valid", async () => {
				await expect(userValidations.registerUser(dataUserRegistration)).resolves.not.toThrow();
			});
		});

		describe("#Birthdate Field Validation", () => {
			test("Should throw an error if birthdate is empty", async () => {
				const dataUserMocked = { ...dataUserRegistration, birth_date: "" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Birth date is a required field"));
			});

			test("Should throw an error if birthdate is in the future", async () => {
				const dataUserMocked = { ...dataUserRegistration, birth_date: "2025-01-01T03:00:00.000Z" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("Birth date cannot be in the future"));
			});

			test("Should throw an error if the date is not 18 years ago", async () => {
				const dataUserMocked = { ...dataUserRegistration, birth_date: "2008-01-01T03:00:00.000Z" };
				await expect(userValidations.registerUser(dataUserMocked)).rejects.toThrow(new Error("User must be at least 18 years old"));
			});

			test("Should not throw an error if birthdate is valid", async () => {
				await expect(userValidations.registerUser(dataUserRegistration)).resolves.not.toThrow();
			});
		});
	});

	describe("#Request Reset Password", () => {
		test("Should throw an error if email is empty", async () => {
			const emailRequesterMocked = "";
			await expect(userValidations.requestResetPassword(emailRequesterMocked)).rejects.toThrow(new Error("Email is a required field"));
		});

		test("Should throw an error if email isn't valid ", async () => {
			const emailRequesterMocked = "INVALIDEMAIL";
			await expect(userValidations.requestResetPassword(emailRequesterMocked)).rejects.toThrow(new Error("Enter a valid email"));
		});

		test("Should not throw an error if email is valid", async () => {
			const emailRequesterMocked = "VALIDEMAIL@email.com";
			await expect(userValidations.requestResetPassword(emailRequesterMocked)).resolves.not.toThrow();
		});
	});

	describe("#Confirm Reset Password", () => {
		const confirmMocked = {
			code: "VALIDCODE",
			password: "Vpass123!@",
		};

		test("Should throw an error if code is empty", async () => {
			confirmMocked.code = "";
			await expect(userValidations.confirmResetPassword(confirmMocked)).rejects.toThrow("Code is a required field");
		});

		test("should throw an error if password is empty", async () => {
			confirmMocked.password = "";
			await expect(userValidations.confirmResetPassword(confirmMocked)).rejects.toThrow("Password is a required field");
		});

		test("should throw an error if password is less than 8 characters", async () => {
			confirmMocked.password = "short";
			await expect(userValidations.confirmResetPassword(confirmMocked)).rejects.toThrow("Password must contain at least 8 characters");
		});

		test("should throw an error if password is more than 16 characters", async () => {
			confirmMocked.password = "verylongpassword1234567890";
			await expect(userValidations.confirmResetPassword(confirmMocked)).rejects.toThrow("The password can only contain up to 16 characters");
		});

		test("should throw an error if password does not contain a letter", async () => {
			confirmMocked.password = "1234567890";

			await expect(userValidations.confirmResetPassword(confirmMocked)).rejects.toThrow("Password must contain at least one letter");
		});

		test("should throw an error if password does not contain a number", async () => {
			confirmMocked.password = "abcdefghij";
			await expect(userValidations.confirmResetPassword(confirmMocked)).rejects.toThrow("Password must contain at least one number");
		});

		test("should throw an error if password does not contain a special character", async () => {
			confirmMocked.password = "abcdefghij123";
			await expect(userValidations.confirmResetPassword(confirmMocked)).rejects.toThrow("Password must contain at least one special character");
		});

		test("should not throw an error if code and password are valid", async () => {
			confirmMocked.password = "Vpass123!@";
			confirmMocked.code = "VALIDCODE";
			await expect(userValidations.confirmResetPassword(confirmMocked)).resolves.not.toThrow();
		});
	});
});
