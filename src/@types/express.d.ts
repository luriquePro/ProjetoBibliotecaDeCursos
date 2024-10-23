import { IUserDTO } from "../interfaces/UserInterface.ts";

declare global {
	namespace Express {
		export interface Request {
			user: Partial<IUserDTO>;
			is_authenticated: boolean | undefined;
		}
	}
}
