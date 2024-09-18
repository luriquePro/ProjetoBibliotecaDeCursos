import { IRequest, IResponse } from "../interfaces/AppInterfaces.ts";
import { IIndexService } from "../services/IndexService.ts";

type IIndexQuery = { revere?: string };

export class IndexController {
	constructor(private readonly indexService: IIndexService) {}
	public async index(request: IRequest, response: IResponse) {
		const query = request.query as IIndexQuery;
		const revere = query?.revere;

		const { is_error, message, statusCode } = await this.indexService.index(revere);
		response.statusCode = statusCode;
		return response.end(JSON.stringify({ message, is_error }));
	}
}
