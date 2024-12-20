import { Router } from "express";
import { UserController } from "../controllers/UserController.ts";
import { IsAuthenticate } from "../middlewares/AuthenticateMiddleware.ts";
import { isProtection } from "../middlewares/ProtectionMiddleware.ts";
import { RateLimit } from "../middlewares/RateLimitMiddleware.ts";
import { isAllowed } from "../middlewares/RolesMiddleware.ts";
import { SetUserApm } from "../middlewares/SetUserApmMiddleware.ts";
import { ConfiguresModel } from "../models/Configures.ts";
import { client } from "../models/Redis.ts";
import { SessionModel } from "../models/Session.ts";
import { UserModel } from "../models/User.ts";
import { ConfiguresRepository } from "../repositories/ConfiguresRepository.ts";
import { RedisRepository } from "../repositories/RedisRepository.ts";
import { SessionRepository } from "../repositories/SessionRepository.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { ConfiguresService } from "../services/ConfiguresService.ts";
import { SessionService } from "../services/SessionService.ts";
import { UserService } from "../services/UserSevice.ts";
import { ConfiguresValidations } from "../validations/ConfiguresValidations.ts";
import { UserValidations } from "../validations/UserValidations.ts";

const UserRoutes = Router();

const sessionRepository = new SessionRepository(SessionModel);
const sessionService = new SessionService(sessionRepository);

const userValidations = new UserValidations();
const userRepository = new UserRepository(UserModel);

const redisRepository = new RedisRepository(client);

const configuresRepository = new ConfiguresRepository(ConfiguresModel);
const configuresValidations = new ConfiguresValidations();
const configuresService = new ConfiguresService(configuresRepository, configuresValidations);

const userService = new UserService(userValidations, userRepository, redisRepository, sessionService, configuresService);
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

UserRoutes.get(
	"/show",
	IsAuthenticate,
	SetUserApm,
	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
	userController.showUser.bind(userController),
);

UserRoutes.patch(
	"/change-password",
	IsAuthenticate,
	SetUserApm,
	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
	userController.changePassword.bind(userController),
);

UserRoutes.post(
	"/upload-avatar",
	IsAuthenticate,
	SetUserApm,
	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
	userController.uploadAvatar.bind(userController),
);

UserRoutes.post(
	"/set-roles/:userId",
	IsAuthenticate,
	isProtection,
	isAllowed(["admin"]),
	SetUserApm,
	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
	userController.setRoles.bind(userController),
);

UserRoutes.post(
	"/remove-roles/:userId",
	IsAuthenticate,
	isProtection,
	isAllowed(["admin"]),
	SetUserApm,
	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
	userController.removeRoles.bind(userController),
);

UserRoutes.get(
	"/get-profile/:userId",
	IsAuthenticate,
	isAllowed(["admin", "editor", "manager"]),
	SetUserApm,
	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
	userController.getUserProfile.bind(userController),
);

UserRoutes.post(
	"/logout",
	IsAuthenticate,
	isAllowed(["admin"]),
	SetUserApm,
	RateLimit({ limitRequestPerTime: 3, timeLimitInSeconds: 1 }),
	userController.logoutManyUsers.bind(userController),
);

export { UserRoutes };
