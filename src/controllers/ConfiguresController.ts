import { Request, Response } from "express";
import { IConfiguresCreateDTO, IConfiguresService } from "../interfaces/ConfigureInterface.ts";

class ConfiguresController {
	constructor(private readonly configuresService: IConfiguresService) {}

	public async createConfigure(req: Request, res: Response): Promise<Response> {
		const dataConfigure: IConfiguresCreateDTO = { config: req.body.config, value: req.body.value };
		const result = await this.configuresService.createConfigure(dataConfigure);
		return res.status(201).json(result);
	}
}

export { ConfiguresController };
