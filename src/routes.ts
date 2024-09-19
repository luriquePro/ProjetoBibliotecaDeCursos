import { Router } from "express";
import { IndexRoutes } from "./routes/IndexRoutes.ts";
import { JestRoutes } from "./routes/JestRoutes.ts";

const routes = Router();

routes.use("/", IndexRoutes);
routes.use("/jest", JestRoutes);

export { routes };
