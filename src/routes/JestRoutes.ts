import { IndexService } from "../services/IndexService.ts";
import { IndexController } from "../controllers/IndexController.ts";
import { Router } from "express";
import { IndexModel } from "../models/Index.ts";
import { IndexRepository } from "../repositories/IndexRepository.ts";
import { IndexValidations } from "../validations/IndexValidations.ts";
import { RateLimit } from "../middlewares/RateLimitMiddleware.ts";

const indexValidations = new IndexValidations();
const indexRepository = new IndexRepository(IndexModel);
const jestService = new IndexService(indexValidations, indexRepository);
const jestController = new IndexController(jestService);

const JestRoutes = Router();
JestRoutes.get("/say-hello", RateLimit({ limitRequestPerTime: 5, timeLimitInSeconds: 10 }), jestController.index.bind(jestController));

export { JestRoutes };
