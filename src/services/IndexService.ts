import { IMessageReturn } from "../interfaces/AppInterfaces.ts";

export interface IIndexService {
	index(): Promise<IMessageReturn>;
}

export class IndexService {
	public async index(): Promise<IMessageReturn> {
		return { message: "Hello, World!", is_error: false, statusCode: 200 };
	}
}
