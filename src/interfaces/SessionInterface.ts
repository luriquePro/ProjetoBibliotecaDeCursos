import { FilterQuery, UpdateQuery } from "mongoose";
import { SESSION_STATUS } from "../constants/USER.ts";

export interface ISessionDTO {
	id: string;
	status: SESSION_STATUS;
	user: string;
	start_session: Date;
	end_session: Date;
}

export interface ISessionCreateDTO {
	id: string;
	user: string;
	start_session: Date;
	end_session: Date;
}

export interface ISessionService {
	createUserSession(userId: string): Promise<ISessionDTO>;
	inactivateAllUserSessions(userId: string): Promise<void>;
	getLastLogin(userId: string): Promise<Date>;
	getUserOpenSession(userId: string): Promise<ISessionDTO | null>;
}

export interface ISessionRepository {
	create(dataSession: ISessionCreateDTO): Promise<ISessionDTO>;
	updateByObj(dataFilter: FilterQuery<ISessionDTO>, dataUpdate: UpdateQuery<ISessionDTO>): Promise<void>;
	findOneByObj(dataFilter: FilterQuery<ISessionDTO>): Promise<ISessionDTO | null>;
}
