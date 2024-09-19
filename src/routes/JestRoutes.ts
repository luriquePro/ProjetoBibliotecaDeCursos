import { IndexService } from "../services/IndexService.ts";
import { IndexController } from "../controllers/IndexController.ts";
import { Router } from "express";

const jestService = new IndexService();
const jestController = new IndexController(jestService);

const JestRoutes = Router();
JestRoutes.get("/say-hello", jestController.index.bind(jestController));

export { JestRoutes };
