import moment from "moment";

import { SESSION_DURATION_TIME_IN_MINUTES } from "../constants/GLOBAL.ts";
import { SESSION_STATUS } from "../constants/USER.ts";
import { ISessionCreateDTO, ISessionDTO, ISessionRepository, ISessionService } from "../interfaces/SessionInterface.ts";
import { IdGenerate } from "../utils/IdGenerate.ts";

class SessionService implements ISessionService {
	constructor(private readonly sessionRepository: ISessionRepository) {}

	public async createUserSession(userId: string): Promise<ISessionDTO> {
		const dataSession: ISessionCreateDTO = {
			id: IdGenerate(),
			user: userId,
			start_session: moment().utc().toDate(),
			end_session: moment().utc().add(SESSION_DURATION_TIME_IN_MINUTES, "minutes").toDate(),
		};

		const session = await this.sessionRepository.create(dataSession);
		return session;
	}

	public async inactivateAllUserSessions(userId: string): Promise<void> {
		return await this.sessionRepository.updateByObj({ user: userId }, { status: SESSION_STATUS.DISABLED });
	}

	public async getLastLogin(userId: string): Promise<Date> {
		const lastSession = await this.sessionRepository.findOneByObj({ user: userId });
		return lastSession?.start_session!;
	}

	public async getUserOpenSession(userId: string): Promise<ISessionDTO | null> {
		return await this.sessionRepository.findOneByObj({
			user: userId,
			status: SESSION_STATUS.ACTIVE,
			end_session: { $gte: moment().utc().toDate() },
			start_session: { $lte: moment().utc().toDate() },
		});
	}
}

export { SessionService };
