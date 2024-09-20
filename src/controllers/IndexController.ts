import { Request, Response } from "express";
import { IIndexService } from "../interfaces/IndexInterface.ts";

export class IndexController {
	constructor(private readonly indexService: IIndexService) {}
	public async index(request: Request, response: Response) {
		const revere = request.query.revere as string | undefined;

		const { is_error, message, status_code } = await this.indexService.index(revere);

		response.status(status_code);
		return response.json({ message, is_error });
	}
}
