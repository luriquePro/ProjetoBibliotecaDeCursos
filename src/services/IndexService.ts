import { IMessageReturn } from "../interfaces/AppInterfaces.ts";

export interface IIndexService {
	index(revere?: string): Promise<IMessageReturn>;
}

export class IndexService {
	public async index(revere?: string): Promise<IMessageReturn> {
		return { message: `Hello, ${revere ?? "World"}!`, is_error: false, statusCode: 200 };
	}
}
