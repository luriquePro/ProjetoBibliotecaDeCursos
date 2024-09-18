import { IRequest, IResponse } from "../interfaces/AppInterfaces.ts";
import { IIndexService } from "../services/IndexService.ts";

export class IndexController {
	constructor(private readonly indexService: IIndexService) {}
	public async index(request: IRequest, response: IResponse) {
		const { is_error, message, statusCode } = await this.indexService.index();
		response.statusCode = statusCode;
		return response.end(JSON.stringify({ message, is_error }));
	}
}
