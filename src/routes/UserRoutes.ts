import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { RateLimit } from "../middlewares/RateLimitMiddleware.ts";
import { client } from "../models/Redis.ts";
import { SessionModel } from "../models/Session.ts";
import { UserModel } from "../models/User.ts";
import { RedisRepository } from "../repositories/RedisRepository.ts";
import { SessionRepository } from "../repositories/SessionRepository.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { SessionService } from "../services/SessionService.ts";
import { UserService } from "../services/UserSevice.ts";
import { UserValidations } from "../validations/UserValidations.ts";
const UserRoutes = Router();

const sessionRepository = new SessionRepository(SessionModel);
const sessionService = new SessionService(sessionRepository);

const userValidations = new UserValidations();
const userRepository = new UserRepository(UserModel);

const redisRepository = new RedisRepository(client);

const userService = new UserService(userValidations, userRepository, redisRepository, sessionService);
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

UserRoutes.post("/authenticate", RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }), userController.authenticate.bind(userController));

// UserRoutes.post(
// 	"/change-password",
// 	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
// 	IsAuthenticate,
// 	SetUserApm,
// 	userController.changePassowrd.bind(userController),
// );

export { UserRoutes };
