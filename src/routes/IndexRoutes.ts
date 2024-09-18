import { IndexController } from "../controllers/IndexController.ts";
import { IRoute } from "../interfaces/AppInterfaces.ts";

const indexController = new IndexController();

export const IndexRoutes: IRoute[] = [
	{
		path: "/jest/say-hello",
		method: "GET",
		handler: indexController.index.bind(indexController),
	},
];
