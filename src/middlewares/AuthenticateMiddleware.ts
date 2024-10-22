import { NextFunction, Request, Response } from "express";
const IsAuthenticate = (req: Request, res: Response, next: NextFunction) => {
	next();
};

export { IsAuthenticate };
