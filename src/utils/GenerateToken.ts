import jwt from "jsonwebtoken";

import { SESSION_DURATION_TIME_IN_MINUTES } from "../constants/GLOBAL.ts";
import { ISessionDTO } from "../interfaces/SessionInterface.ts";
import { IGenerateTokenReturn, ITokenCreateDTO, IUserDTO } from "../interfaces/UserInterface.ts";

const GenerateToken = (user: IUserDTO, session: ISessionDTO): IGenerateTokenReturn => {
	const dataToken: ITokenCreateDTO = {
		sessionId: session.id,
		userId: user.id,
		login: user.login,
	};

	const token = jwt.sign(dataToken, process.env.JWT_SECRET_KEY!, { expiresIn: `${SESSION_DURATION_TIME_IN_MINUTES}m` });
	const result: IGenerateTokenReturn = {
		token: token,
		name: user.first_name + " " + user.last_name,
		email: user.email,
		id: user.id,
		start_session: session.start_session,
		end_session: session.end_session,
	};

	return result;
};

export { GenerateToken };
