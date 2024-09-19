import { IndexService } from "./../services/IndexService.ts";
import { IndexController } from "../controllers/IndexController.ts";
import { Router } from "express";

const indexService = new IndexService();
const indexController = new IndexController(indexService);

const IndexRoutes = Router();

IndexRoutes.get("/", indexController.index.bind(indexController));

export { IndexRoutes };
