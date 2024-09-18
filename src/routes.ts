import { IRequest, IResponse } from "./interfaces/AppInterfaces.ts";
import { ROUTES } from "./constants/ROUTES.ts";

export class Routes {
	public getValidRoutes = () => {
		const routes = this.getRoutes();
		return routes?.map(({ path }) => path);
	};

	public getRoutes() {
		return ROUTES;
	}

	private getQueryParams(request: IRequest) {
		const [, ...query] = request.url!.split("?");
		let reqQuery: { [key: string]: string | number } = {};

		if (query.length) {
			const queryParams = new URLSearchParams(query[0]);
			queryParams.forEach((value: string | number, key) => {
				reqQuery[key] = isNaN(value as number) ? value : Number(value);
			});
		}

		return Object.keys(reqQuery).length > 0 ? reqQuery : undefined;
	}

	public async run(request: IRequest, response: IResponse) {
		if (request.url) {
			const [url] = request.url.split("?");

			// Checa se é uma rota valida.
			const validRoutes = this.getValidRoutes();
			const isAValidRoute = validRoutes?.some(route => route === url);
			if (!isAValidRoute) {
				response.statusCode = 404;
				return response.end(JSON.stringify({ message: "Route not found!", is_error: true }));
			}

			const routes = this.getRoutes();
			const route = routes.find(({ path, method }) => path === url && method === request.method);
			if (!route) {
				response.statusCode = 405;
				return response.end(JSON.stringify({ message: "Method not allowed!", is_error: true }));
			}

			request.query = this.getQueryParams(request);

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
}
