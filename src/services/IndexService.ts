import { IIndexRepository, IIndexValidations, IMessageReturn } from "../interfaces/IndexInterface.ts";

export class IndexService {
	constructor(
		private readonly indexValidations: IIndexValidations,
		private readonly indexRepository: IIndexRepository,
	) {}
	public async index(name?: string): Promise<IMessageReturn> {
		await this.indexValidations.index({ name });
		const result = await this.indexRepository.findOneByObj({ name });
		return { message: `Hello, ${result?.name ?? "World"}!`, is_error: false, status_code: 200 };
	}
}
