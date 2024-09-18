import { createServer } from "http";
import { Routes } from "./routes.ts";

const server = createServer(async (request, response) => {
	// Configurações do Servidor
	response.setHeader("Content-Type", "application/json");
	// Cors

	// Rotas
	const ROUTER = new Routes();
	await ROUTER.run(request, response);
});

export { server };
