import ElasticApmNode from "elastic-apm-node";

// Função que captura operações do Mongoose
const captureMongooseOperation = async (entity: string, operation: string, callback: () => Promise<any>): Promise<any> => {
	const transaction = ElasticApmNode.startTransaction(`MongoDB - ${entity} - ${operation}`, "db.mongodb");

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

// Decorador para capturar operações do Mongoose
export const captureOperation = (entity: string, operation: string) => {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const operationName = `${propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1)} (${operation})`;
			return await captureMongooseOperation(entity, operationName, () => originalMethod.apply(this, args));
		};
	};
};
