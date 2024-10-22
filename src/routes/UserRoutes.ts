import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { RateLimit } from "../middlewares/RateLimitMiddleware.ts";
import { client } from "../models/Redis.ts";
import { UserModel } from "../models/User.ts";
import { RedisRepository } from "../repositories/RedisRepository.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { UserService } from "../services/UserSevice.ts";
import { UserValidations } from "../validations/UserValidations.ts";
const UserRoutes = Router();

const userValidations = new UserValidations();
const userRepository = new UserRepository(UserModel);

const redisRepository = new RedisRepository(client);

const userService = new UserService(userValidations, userRepository, redisRepository);
const userController = new UserController(userService);

UserRoutes.post("/register", RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }), userController.registerUser.bind(userController));

UserRoutes.post(
	"/request-reset-password",
	RateLimit({ limitRequestPerTime: 2, timeLimitInSeconds: 1 }),
	userController.requestResetPassword.bind(userController),
);

UserRoutes.post(
	"/confirm-reset-password",
	RateLimit({ limitRequestPerTime: 5, timeLimitInSeconds: 1 }),
	userController.confirmResetPassword.bind(userController),
);

// UserRoutes.post("/login", RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }), userController.login.bind(userController));

// UserRoutes.post(
// 	"/change-password",
// 	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
// 	IsAuthenticate,
// 	SetUserApm,
// 	userController.changePassowrd.bind(userController),
// );

export { UserRoutes };
