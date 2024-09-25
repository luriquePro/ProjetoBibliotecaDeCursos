import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { UserService } from "../services/UserSevice.ts";
import { UserValidations } from "../validations/UserValidations.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { UserModel } from "../models/User.ts";
import { client } from "../models/Redis.ts";
import { RedisRepository } from "../repositories/RedisRepository.ts";
const UserRoutes = Router();

const userValidations = new UserValidations();
const userRepository = new UserRepository(UserModel);

const redisRepository = new RedisRepository(client);

const userService = new UserService(userValidations, userRepository, redisRepository);
const userController = new UserController(userService);

UserRoutes.post("/register", userController.registerUser.bind(userController));
UserRoutes.post("/request-reset-password", userController.requestResetPassword.bind(userController));
UserRoutes.post("/confirm-reset-password", userController.confirmResetPassword.bind(userController));

export { UserRoutes };
