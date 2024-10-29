import * as yup from "yup";
import { IConfiguresCreateDTO, IConfiguresValidations } from "../interfaces/ConfigureInterface.ts";
import { YupValidator } from "../utils/YupValidator.ts";

class ConfiguresValidations implements IConfiguresValidations {
	public async createConfigure({ config, value }: IConfiguresCreateDTO) {
		const dataValidation = { config, value };
		const shapeValidation = { config: yup.string().required("Config is a required field"), value: yup.mixed().required("Value is a required field") };

		await YupValidator(shapeValidation, dataValidation, "configures");
	}
}

export { ConfiguresValidations };
