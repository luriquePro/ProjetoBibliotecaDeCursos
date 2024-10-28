import { ISessionDTO } from "../interfaces/SessionInterface.ts";
import { IUserDTO } from "../interfaces/UserInterface.ts";

declare global {
	namespace Express {
		export interface Request {
			user: IUserDTO | undefined;
			session: ISessionDTO | undefined;
			is_authenticated: boolean | undefined;
		}
	}
}
