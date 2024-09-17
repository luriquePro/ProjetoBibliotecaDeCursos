import { createServer } from "node:http";

const server = createServer((request, response) => {
	response.setHeader("Content-Type", "application/json");
	response.statusCode = 200;
	return response.end(JSON.stringify({ message: "Hello, World!", is_error: false }));
});

export { server };
