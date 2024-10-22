import { Document, Schema, model } from "mongoose";
import { v4 } from "uuid";
import { IIndexDTO } from "../interfaces/IndexInterface.ts";

export interface IIndexMongo extends Partial<Omit<Document, "id">>, IIndexDTO {}

const IndexSchema = new Schema<IIndexMongo>(
	{
		id: { type: String, required: true, trim: true, index: true, unique: true, default: v4() },
		name: { type: String, required: true, trim: true, index: true },
		status: { type: String, required: true, trim: true, index: true },
	},
	{ timestamps: true },
);

export const IndexModel = model<IIndexMongo>("indexs", IndexSchema);
