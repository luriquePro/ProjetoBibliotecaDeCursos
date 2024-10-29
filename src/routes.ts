import { Router } from "express";
import { ConfiguresRoutes } from "./routes/ConfiguresRoutes.ts";
import { IndexRoutes } from "./routes/IndexRoutes.ts";
import { JestRoutes } from "./routes/JestRoutes.ts";
import { UserRoutes } from "./routes/UserRoutes.ts";

const routes = Router();

routes.use("/", IndexRoutes);
routes.use("/jest", JestRoutes);
routes.use("/users", UserRoutes);
routes.use("/configures", ConfiguresRoutes);

export { routes };
