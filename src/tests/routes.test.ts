import { describe, test, expect, jest, afterEach } from "@jest/globals";
import { Routes } from "../routes.ts";
import { IncomingMessage, ServerResponse } from "http";

describe("#Routes Suite", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test("Should return a message with 'Hello, World!' if route exists and method is valid", async () => {
		const request = { url: "/jest/say-hello", method: "GET" } as IncomingMessage;
		const response = { end: jest.fn(), statusCode: 0 } as unknown as ServerResponse;
		const routes = new Routes();

		await routes.run(request, response);

		expect(response.statusCode).toBe(200);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify({ message: "Hello, World!", is_error: false }));
	});

	test("Should throw an error if route does not exists", async () => {
		const request = { url: "/invalid-route", method: "GET" } as IncomingMessage;
		const response = { end: jest.fn(), statusCode: 0 } as unknown as ServerResponse;
		const routes = new Routes();

		await routes.run(request, response);

		expect(response.statusCode).toBe(404);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify({ message: "Route not found!", is_error: true }));
	});

	test("Should throw an error if route exists and method is not valid", async () => {
		const request = { url: "/jest/say-hello", method: "POST" } as IncomingMessage;
		const response = { end: jest.fn(), statusCode: 0 } as unknown as ServerResponse;
		const routes = new Routes();

		await routes.run(request, response);

		expect(response.statusCode).toBe(405);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify({ message: "Method not allowed!", is_error: true }));
	});

	test("Should throw an default error if route handle break", async () => {
		jest.spyOn(Routes.prototype, "getRoutes").mockImplementation(() => {
			return [
				{
					path: "/jest/say-hello",
					method: "GET",
					handler: () => {
						throw new Error("Something went wrong!");
					},
				},
			];
		});

		const request = { url: "/jest/say-hello", method: "GET" } as IncomingMessage;
		const response = { end: jest.fn(), statusCode: 0 } as unknown as ServerResponse;
		const routes = new Routes();

		await routes.run(request, response);

		expect(response.statusCode).toBe(500);
		expect(response.end).toHaveBeenCalledWith(JSON.stringify({ message: "Something went wrong!", is_error: true }));
	});
});
