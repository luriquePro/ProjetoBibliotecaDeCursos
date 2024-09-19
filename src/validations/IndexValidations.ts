import * as yup from "yup";
import { YupValidator } from "../utils/YupValidator.ts";

class IndexValidations {
	public async index({ a, b }: { a: string; b: number }) {
		const dataValidation = { a, b };

		const shapeValidation = {
			a: yup.string().strict().required(),
			b: yup.number().strict().required(),
		};

		await YupValidator(shapeValidation, dataValidation);
	}
}

export { IndexValidations };
