import { INDEX_STATUS } from "../constants/INDEX.ts";

// Data to set Model
export interface IIndexDTO {
	id: string;
	name: string;
	status: INDEX_STATUS;
}

// Data filter
export interface IIndexFind {
	id?: string | { $in: string[] };
	name?: string | { $in: string[] };
	status?: INDEX_STATUS | { $in: INDEX_STATUS[] } | { $ne: INDEX_STATUS };
}

// Repository
export interface IIndexRepository {
	findOneByObj(filter: IIndexFind): Promise<IIndexDTO | null>;
}

// Service
export interface IIndexService {
	index(name?: string): Promise<IMessageReturn>;
}

// Validations
export interface IIndexValidations {
	index(dataValidation: { name?: string }): Promise<void>;
}

// Default Return
export interface IMessageReturn {
	message: string;
	is_error: boolean;
	status_code: number;
}
