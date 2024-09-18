import { IndexService } from "./../services/IndexService.ts";
import { IndexController } from "../controllers/IndexController.ts";
import { IRoute } from "../interfaces/AppInterfaces.ts";

const indexService = new IndexService();
const indexController = new IndexController(indexService);

export const IndexRoutes: IRoute[] = [
	{
		path: "/jest/say-hello",
		method: "GET",
		handler: indexController.index.bind(indexController),
	},
];
