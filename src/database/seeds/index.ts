import "dotenv/config";

import mongoose from "mongoose";
import { ConfiguresModel } from "../../models/Configures.ts";

const URL = process.env.MONGODB_URI!;
mongoose
	.connect(URL, { dbName: process.env.MONGODB_DATABASE })
	.then(() => console.log(`MongoDB connected!`))
	.then(() => runSeeds())
	.then(() => process.exit(0))
	.catch(err => console.log("Error to connect mongoDB", err));

// Criar configurações

const runSeeds = async () => {
	const backupConfigures = [
		{
			config: "do_authenticate_when_registering",
			value: true,
			status: "ACTIVE",
		},
	];
	try {
		await ConfiguresModel.insertMany(backupConfigures, { ordered: false }).then(() => console.log("Configurações criadas com sucesso!"));
	} catch {}
};
