import * as yup from "yup";
import { AppError } from "../shared/errors/AppError.ts";
import { Logger } from "../shared/Logger.ts";

const YupValidator = async (dataShape: yup.AnyObject, dataValidation: object, entity: string) => {
	const logger = new Logger(entity);

	try {
		const schema = yup.object().shape(dataShape);
		await schema.validate(dataValidation);
	} catch (error: any) {
		console.log(error);

		await logger.error({
			entityId: "NE",
			statusCode: 400,
			title: `Error on ${entity} validation, in ${error.path} field `,
			description: error.message,
			objectData: {
				received: error.params.value,
				details: error.params.spec
			}
		});
		throw new AppError(error.message, 400);
	}
};

export { YupValidator };
