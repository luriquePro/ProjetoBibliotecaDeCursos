import { NextFunction, Request, Response } from "express";
import { Roles } from "../interfaces/UserInterface.ts";
import { UnauthorizedError } from "../shared/errors/AppError.ts";

const isAllowed = (roles: Roles[] = []) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userRoles = req.user!.roles;

		let hasRolesAllowed = false;
		if (userRoles?.includes("admin")) {
			hasRolesAllowed = true;
		}

		if (!hasRolesAllowed) {
			for (const role of roles) {
				if (userRoles?.includes(role)) {
					hasRolesAllowed = true;
				}
			}
		}

		if (!hasRolesAllowed) {
			throw new UnauthorizedError("You don't have permission to access this resource");
		}

		return next();
	};
};

export { isAllowed };
