import { describe, expect, test } from "@jest/globals";
import { IdGenerate } from "../../utils/IdGenerate.ts";

describe("Gerador de Id", () => {
	test("Deve-se gerar um id", () => expect(IdGenerate()).not.toBeNull());
});
