import { Router } from "express";

import { IndexService } from "./../services/IndexService.ts";
import { IndexController } from "../controllers/IndexController.ts";
import { IndexValidations } from "../validations/IndexValidations.ts";
import { IndexRepository } from "../repositories/IndexRepository.ts";
import { IndexModel } from "../models/Index.ts";

const indexValidations = new IndexValidations();
const indexRepository = new IndexRepository(IndexModel);
const indexService = new IndexService(indexValidations, indexRepository);
const indexController = new IndexController(indexService);

const IndexRoutes = Router();

IndexRoutes.get("/", indexController.index.bind(indexController));

export { IndexRoutes };
