import { Document, Schema, model } from "mongoose";
import { CONFIGURE_STATUS } from "../constants/CONFIGURE.ts";
import { IConfiguresDTO } from "../interfaces/ConfigureInterface.ts";

export interface IConfiguresMongo extends Partial<Omit<Document, "id">>, IConfiguresDTO {}

const ConfiguresSchema = new Schema<IConfiguresMongo>(
	{
		config: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
		value: {
			type: Schema.Types.Mixed,
			required: true,
			trim: true,
			validate: {
				validator: (value: unknown) => {
					// Verifica se o valor é uma String, Number ou Boolean
					return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
				},
				message: "O campo 'value' deve ser do tipo String, Number ou Boolean.",
			},
		},
		status: {
			type: String,
			required: true,
			default: CONFIGURE_STATUS.ACTIVE,
		},
	},
	{
		timestamps: true,
	},
);

export const ConfiguresModel = model<IConfiguresMongo>("configures", ConfiguresSchema);
