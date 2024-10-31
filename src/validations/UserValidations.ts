import moment from "moment";
import * as yup from "yup";
import { IAuthenticate, IChangePassword, IConfirmResetPassword, IUserRegisterDTO, IUserValidation } from "../interfaces/UserInterface.ts";
import { CpfValidator } from "../utils/CpfValidator.ts";
import { YupValidator } from "../utils/YupValidator.ts";

class UserValidations implements IUserValidation {
	public async registerUser({ full_name, email, password, cpf, birth_date, login }: IUserRegisterDTO) {
		const dataValidation = { full_name, email, password, cpf, birth_date, login };

		const shapeValidation = {
			full_name: yup
				.string()
				.required("Full name is a required field")
				.min(6, "Enter your full name")
				.max(50, "The full name can only contain up to 50 characters")
				.test("last_name_is_required", "Last Name is required", value => !!value.includes(" "))
				.test("full_name_invalid", "Full name field can only contain letters and spaces", value => {
					const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // RegEx para letras e espaços
					return !!value && nameRegex.test(value);
				}),
			login: yup
				.string()
				.required("Login is a required field")
				.min(6, "Login must contain at least 6 characters")
				.max(16, "The login can only contain up to 16 characters")
				.test("login-cannot-be-email", "Login cannot be in email format", value => {
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // RegEx para email
					return !!value && !emailRegex.test(value);
				})
				.test("login-can-be-contain-letters-numbers-and-space", "Login field can only contain letters, numbers and spaces", value => {
					const loginRegex = /^[A-Za-z0-9\s]+$/; // RegEx para letras, números e espaços
					return !!value && loginRegex.test(value);
				})
				.test("login-must-contain-at-least-one-letter", "Login must contain at least one letter", value => {
					const letterRegex = /[A-Za-z]/; // RegEx para pelo menos uma letra
					return !!value && letterRegex.test(value);
				}),
			email: yup.string().required("Email is a required field").email("Enter a valid email"),
			cpf: yup
				.string()
				.required("Cpf is a required field")
				.min(11, "Cpf must contain 11 digits")
				.max(11, "Cpf must contain 11 digits")
				.test("cpf-can-only-contain-numbers", "Cpf can only contain numbers", value => {
					const cpfRegex = /^[0-9]+$/; // RegEx para apenas números
					return !!value && cpfRegex.test(value);
				})
				.test("cpf", "Cpf is invalid", value => CpfValidator(value)),
			password: yup
				.string()
				.required("Password is a required field")
				.min(8, "Password must contain at least 8 characters")
				.max(16, "The password can only contain up to 16 characters")
				.test("password-must-contain-at-least-one-letter", "Password must contain at least one letter", value => {
					const letterRegex = /[A-Za-z]/; // RegEx para pelo menos uma letra
					return !!value && letterRegex.test(value);
				})
				.test("password-must-contain-at-least-one-number", "Password must contain at least one number", value => {
					const numberRegex = /[0-9]/; // RegEx para pelo menos um número
					return !!value && numberRegex.test(value);
				})
				.test("password-must-contain-at-least-one-special-character", "Password must contain at least one special character", value => {
					const specialCharacterRegex = /[^A-Za-z0-9]/; // RegEx para pelo menos um caractere especial
					return !!value && specialCharacterRegex.test(value);
				}),
			birth_date: yup
				.string()
				.required("Birth date is a required field")
				.test("birth_date-invalid", "Birth date is invalid", value => {
					return !moment(value, "YYYY-MM-DD", true).isValid();
				})
				.test("birth_date-future", "Birth date cannot be in the future", value => {
					return moment(value).isBefore(moment());
				})
				.test("birth_date-18", "User must be at least 18 years old", value => {
					const age = moment().diff(moment(value), "years");
					return age >= 18;
				}),
		};

		await YupValidator(shapeValidation, dataValidation, "user");
	}

	public async requestResetPassword(emailRequester: string): Promise<void> {
		const dataValidation = { email: emailRequester };
		const shapeValidation = { email: yup.string().required("Email is a required field").email("Enter a valid email") };

		await YupValidator(shapeValidation, dataValidation, "user");
	}

	public async confirmResetPassword({ code, password }: IConfirmResetPassword): Promise<void> {
		const dataValidation = { code, password };
		const shapeValidation = {
			code: yup.string().required("Code is a required field"),
			password: yup
				.string()
				.required("Password is a required field")
				.min(8, "Password must contain at least 8 characters")
				.max(16, "The password can only contain up to 16 characters")
				.test("password-must-contain-at-least-one-letter", "Password must contain at least one letter", value => {
					const letterRegex = /[A-Za-z]/; // RegEx para pelo menos uma letra
					return !!value && letterRegex.test(value);
				})
				.test("password-must-contain-at-least-one-number", "Password must contain at least one number", value => {
					const numberRegex = /[0-9]/; // RegEx para pelo menos um número
					return !!value && numberRegex.test(value);
				})
				.test("password-must-contain-at-least-one-special-character", "Password must contain at least one special character", value => {
					const specialCharacterRegex = /[^A-Za-z0-9]/; // RegEx para pelo menos um caractere especial
					return !!value && specialCharacterRegex.test(value);
				}),
		};
		await YupValidator(shapeValidation, dataValidation, "user");
	}

	public async authenticate({ login, password }: IAuthenticate): Promise<void> {
		const dataValidation = { login, password };

		const shapeValidation = {
			login: yup.string().required("Login is a required field").min(6, "Login must contain at least 6 characters"),
			password: yup
				.string()
				.required("Password is a required field")
				.min(8, "Password must contain at least 8 characters")
				.max(16, "The password can only contain up to 16 characters")
				.test("password-must-contain-at-least-one-letter", "Password must contain at least one letter", value => {
					const letterRegex = /[A-Za-z]/;
					return !!value && letterRegex.test(value);
				})
				.test("password-must-contain-at-least-one-number", "Password must contain at least one number", value => {
					const numberRegex = /[0-9]/;
					return !!value && numberRegex.test(value);
				})
				.test("password-must-contain-at-least-one-special-character", "Password must contain at least one special character", value => {
					const specialCharacterRegex = /[^A-Za-z0-9]/;
					return !!value && specialCharacterRegex.test(value);
				}),
		};

		await YupValidator(shapeValidation, dataValidation, "user");
	}

	public async changePassword({ newPassword, oldPassword, userId }: IChangePassword): Promise<void> {
		const dataValidation = { newPassword, oldPassword, userId };

		const shapeValidation = {
			userId: yup.string().required("Id is a required field"),
			newPassword: yup
				.string()
				.required("New Password is a required field")
				.min(8, "New Password must contain at least 8 characters")
				.max(16, "The New password can only contain up to 16 characters")
				.test("new-password-must-contain-at-least-one-letter", "New Password must contain at least one letter", value => {
					const letterRegex = /[A-Za-z]/;
					return !!value && letterRegex.test(value);
				})
				.test("new-password-must-contain-at-least-one-number", "New Password must contain at least one number", value => {
					const numberRegex = /[0-9]/;
					return !!value && numberRegex.test(value);
				})
				.test("new-password-must-contain-at-least-one-special-character", "New Password must contain at least one special character", value => {
					const specialCharacterRegex = /[^A-Za-z0-9]/;
					return !!value && specialCharacterRegex.test(value);
				}),
			oldPassword: yup
				.string()
				.required("Old Password is a required field")
				.min(8, "Old Password must contain at least 8 characters")
				.max(16, "The Old Password can only contain up to 16 characters")
				.test("old-password-must-contain-at-least-one-letter", "Old Password must contain at least one letter", value => {
					const letterRegex = /[A-Za-z]/;
					return !!value && letterRegex.test(value);
				})
				.test("old-password-must-contain-at-least-one-number", "Old Password must contain at least one number", value => {
					const numberRegex = /[0-9]/;
					return !!value && numberRegex.test(value);
				})
				.test("old-password-must-contain-at-least-one-special-character", "Old Password must contain at least one special character", value => {
					const specialCharacterRegex = /[^A-Za-z0-9]/;
					return !!value && specialCharacterRegex.test(value);
				}),
		};

		await YupValidator(shapeValidation, dataValidation, "user");
	}
}

export { UserValidations };
