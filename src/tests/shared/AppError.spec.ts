import { describe, expect, test } from "@jest/globals";
import { AppError, BadRequestError, NotFoundError, UnauthorizedError } from "../../shared/errors/AppError.ts";

describe("#AppError Suite", () => {
	test("should create an instance of AppError", () => {
		const output = new AppError("Test");
		expect(output).toBeInstanceOf(AppError);
	});

	test("should create an instance of AppError with default status code", () => {
		const output = new AppError("Test");
		expect(output.statusCode).toBe(500);
	});

	test("should create an instance of AppError with custom status code", () => {
		const output = new AppError("Test", 404);
		expect(output.statusCode).toBe(404);
	});
});

describe("BadRequestError", () => {
	test("should create an instance of BadRequestError", () => {
		const output = new BadRequestError("Test");
		expect(output).toBeInstanceOf(BadRequestError);
	});

	test("should create an instance of BadRequestError with status code 400", () => {
		const output = new BadRequestError("Test");
		expect(output.statusCode).toBe(400);
	});
});

describe("NotFoundError", () => {
	test("should create an instance of NotFoundError", () => {
		const output = new NotFoundError("Test");
		expect(output).toBeInstanceOf(NotFoundError);
	});

	test("should create an instance of NotFoundError with status code 404", () => {
		const output = new NotFoundError("Test");
		expect(output.statusCode).toBe(404);
	});
});

describe("UnauthorizedError", () => {
	test("should create an instance of UnauthorizedError", () => {
		const output = new UnauthorizedError("Test");
		expect(output).toBeInstanceOf(UnauthorizedError);
	});

	test("should create an instance of UnauthorizedError with status code 401", () => {
		const output = new UnauthorizedError("Test");
		expect(output.statusCode).toBe(401);
	});
});
