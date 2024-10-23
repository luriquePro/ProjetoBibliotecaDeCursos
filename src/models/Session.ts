import { Document, Schema, model } from "mongoose";
import { SESSION_STATUS } from "../constants/USER.ts";
import { ISessionDTO } from "../interfaces/SessionInterface.ts";

export interface ISessionMongo extends Partial<Omit<Document, "id">>, ISessionDTO {}

const SessionSchema = new Schema<ISessionMongo>(
	{
		id: { type: String, required: true, trim: true, index: true, unique: true },
		status: { type: String, required: true, trim: true, index: true, default: SESSION_STATUS.ACTIVE },
		user: { type: String, required: true, trim: true, index: true },
		start_session: { type: Date, required: true, index: true },
		end_session: { type: Date, required: true, index: true },
	},
	{ timestamps: true },
);

export const SessionModel = model<ISessionMongo>("sessions", SessionSchema);
