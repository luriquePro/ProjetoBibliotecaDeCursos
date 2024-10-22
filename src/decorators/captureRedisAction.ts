import ElasticApmNode from "elastic-apm-node";

// Função que captura operações do Redis
const captureRedisOperation = async (operation: string, key: string, callback: () => Promise<any>): Promise<any> => {
	const transaction = ElasticApmNode.startTransaction(`Redis - ${operation} - ${key}`, "db.redis");

	try {
		const result = await callback();
		transaction.result = "success";
		return result;
	} catch (error) {
		transaction.result = "error";
		ElasticApmNode.captureError(error as Error);
		throw error;
	} finally {
		transaction.end();
	}
};

// Decorador para capturar operações do Redis
export const captureRedisAction = (operation: string) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const key = args[0]; // Assume que o primeiro argumento é a chave
			return await captureRedisOperation(operation, key, () => originalMethod.apply(this, args));
		};
	};
};
