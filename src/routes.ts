import { IRequest, IResponse } from "./interfaces/AppInterfaces.ts";
import { ROUTES } from "./constants/ROUTES.ts";

export class Routes {
	public getValidRoutes = () => {
		const routes = this.getRoutes();
		return routes.map(({ path }) => path);
	};

	public getRoutes() {
		return ROUTES;
	}

	public async run(request: IRequest, response: IResponse) {
		// Checa se é uma rota valida.
		const validRoutes = this.getValidRoutes();
		const isAValidRoute = validRoutes.some(route => route === request.url);
		if (!isAValidRoute) {
			response.statusCode = 404;
			return response.end(JSON.stringify({ message: "Route not found!", is_error: true }));
		}

		const routes = this.getRoutes();
		const route = routes.find(({ path, method }) => path === request.url && method === request.method);
		if (!route) {
			response.statusCode = 405;
			return response.end(JSON.stringify({ message: "Method not allowed!", is_error: true }));
		}

		// Executa a rota
		try {
			return await route.handler(request, response);
		} catch (error) {
			//TODO: Salvar em LOG o error

			response.statusCode = 500;
			return response.end(JSON.stringify({ message: "Something went wrong!", is_error: true }));
		}
	}
}
