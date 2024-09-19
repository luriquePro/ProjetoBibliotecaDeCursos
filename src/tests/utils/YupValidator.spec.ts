import * as yup from "yup";
import { describe, expect, test } from "@jest/globals";

import { YupValidator } from "../../utils/YupValidator.ts";
import { AppError } from "../../shared/errors/AppError.ts";

describe("#YupValidator Suite", () => {
	test("Deve-se validar os dados com sucesso", async () => {
		const result = await YupValidator({ property: yup.string().required() }, { property: "value" });
		expect(result).toBeUndefined();
	});

	test("Deve-se lançar um erro caso os dados sejam inválidos", async () => {
		await expect(YupValidator({ property: yup.string().required() }, {})).rejects.toThrow(new AppError("property is a required field"));
	});
});
