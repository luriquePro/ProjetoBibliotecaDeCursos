import { Roles } from "../interfaces/UserInterface.ts";

export enum USER_STATUS {
	ACTIVE = "ACTIVE",
	DELETED = "DELETED",
}

export enum SESSION_STATUS {
	ACTIVE = "ACTIVE",
	DISABLED = "DISABLED",
	FORCE_DISABLED = "FORCE_DISABLED",
	CANCELED = "CANCELED",
}

export const ALLOWED_AVATAR_IMAGE_TYPES = ["jpg", "jpeg", "png"];

export const MAX_AVATAR_IMAGE_SIZE = 100 * 1024;

export const VALID_ROLES = ["admin", "user", "manager", "editor"] as Roles[];
