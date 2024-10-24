import { Document, Schema, model } from "mongoose";
import { IUserDTO } from "../interfaces/UserInterface.ts";

export interface IUserMongo extends Partial<Omit<Document, "id">>, IUserDTO {}

const UserSchema = new Schema<IUserMongo>(
	{
		id: { type: String, required: true, trim: true, index: true, unique: true },
		first_name: { type: String, required: true, trim: true, index: true },
		last_name: { type: String, required: true, trim: true, index: true },
		cpf: { type: String, required: true, trim: true, index: true, unique: true },
		email: { type: String, required: true, trim: true, index: true, unique: true },
		login: { type: String, required: true, trim: true, index: true, unique: true },
		password: { type: String, required: true, trim: true, index: true },
		birth_date: { type: Date, required: true, index: true },
		status: { type: String, required: true, trim: true, index: true },
	},
	{ timestamps: true },
);

UserSchema.post(["findOne", "findOneAndUpdate"], function (doc) {
	if (doc) {
		doc.password = undefined;
	}
});

export const UserModel = model<IUserMongo>("users", UserSchema);
