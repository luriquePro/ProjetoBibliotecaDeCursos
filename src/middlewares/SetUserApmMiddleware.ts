import ElasticApmNode from "elastic-apm-node";
import { NextFunction, Request, Response } from "express";

const SetUserApm = (request: Request, response: Response, next: NextFunction) => {
	ElasticApmNode.setUserContext({
		id: request.user.id,
		email: request.user.email,
		username: request.user.login,
	});

	next();
};

export { SetUserApm };
