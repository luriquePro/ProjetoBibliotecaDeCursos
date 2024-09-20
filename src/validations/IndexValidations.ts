import * as yup from "yup";
import { YupValidator } from "../utils/YupValidator.ts";
import { IIndexValidations } from "../interfaces/IndexInterface.ts";

class IndexValidations implements IIndexValidations {
	public async index({ name }: { name?: string }) {
		const dataValidation = { name };
		const shapeValidation = { name: yup.string() };

		await YupValidator(shapeValidation, dataValidation);
	}
}

export { IndexValidations };
