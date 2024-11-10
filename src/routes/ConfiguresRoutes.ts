import { Router } from "express";
import { ConfiguresController } from "../controllers/ConfiguresController.ts";
import { IsAuthenticate } from "../middlewares/AuthenticateMiddleware.ts";
import { isAllowed } from "../middlewares/RolesMiddleware.ts";
import { ConfiguresModel } from "../models/Configures.ts";
import { ConfiguresRepository } from "../repositories/ConfiguresRepository.ts";
import { ConfiguresService } from "../services/ConfiguresService.ts";
import { ConfiguresValidations } from "../validations/ConfiguresValidations.ts";
const ConfiguresRoutes = Router();

const configuresRepository = new ConfiguresRepository(ConfiguresModel);
const configuresValidations = new ConfiguresValidations();
const configuresService = new ConfiguresService(configuresRepository, configuresValidations);
const configuresController = new ConfiguresController(configuresService);

ConfiguresRoutes.post("/create", IsAuthenticate, isAllowed(["admin"]), configuresController.createConfigure.bind(configuresController));

export { ConfiguresRoutes };
