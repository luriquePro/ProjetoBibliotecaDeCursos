import { Router } from "express";
import { IndexRoutes } from "./routes/IndexRoutes.ts";
import { JestRoutes } from "./routes/JestRoutes.ts";
import { UserRoutes } from "./routes/UserRoutes.ts";

const routes = Router();

routes.use("/", IndexRoutes);
routes.use("/jest", JestRoutes);
routes.use("/users", UserRoutes);

export { routes };
