import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { UserService } from "../services/UserSevice.ts";
import { UserValidations } from "../validations/UserValidations.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { UserModel } from "../models/User.ts";
const UserRoutes = Router();

const userValidations = new UserValidations();
const userRepository = new UserRepository(UserModel);

const userService = new UserService(userValidations, userRepository);
const userController = new UserController(userService);

UserRoutes.post("/register", userController.registerUser.bind(userController));

export { UserRoutes };
