import { IRequest, IResponse } from "../interfaces/AppInterfaces.ts";

export class IndexController {
	public async index(_request: IRequest, response: IResponse) {
		response.statusCode = 200;
		return response.end(JSON.stringify({ message: "Hello, World!", is_error: false }));
	}
}
