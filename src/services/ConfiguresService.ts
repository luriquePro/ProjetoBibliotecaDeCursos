import { IConfiguresCreateDTO, IConfiguresRepository, IConfiguresService, IConfiguresValidations } from "../interfaces/ConfigureInterface.ts";
import { BadRequestError } from "../shared/errors/AppError.ts";
import { Logger } from "../shared/Logger.ts";

class ConfiguresService implements IConfiguresService {
	constructor(
		private readonly configuresRepository: IConfiguresRepository,
		private readonly configuresValidations: IConfiguresValidations,
		private readonly logger = new Logger("configures"),
	) {}

	public async createConfigure({ config, value }: IConfiguresCreateDTO): Promise<string> {
		const dataValidation = { config, value };
		await this.configuresValidations.createConfigure(dataValidation);

		const configureJustCreated = await this.configuresRepository.findOneByObj({ config });
		if (configureJustCreated) {
			await this.logger.error({
				entityId: "NE",
				statusCode: 400,
				title: "Configure already exists",
				description: "Send a new request to create a new configure with the same config already exists",
				objectData: { config, value },
			});

			throw new BadRequestError("Configure already exists");
		}

		await this.configuresRepository.create({ config, value });
		return "Configure created successfully!";
	}
}

export { ConfiguresService };
