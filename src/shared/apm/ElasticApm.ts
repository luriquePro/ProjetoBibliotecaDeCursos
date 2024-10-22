import ElasticApmNode from "elastic-apm-node";

class ApmService {
	public startElastic() {
		ElasticApmNode.start({
			serviceName: process.env.ELASTIC_APM_SERVICE_NAME,
			secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
			serverUrl: process.env.ELASTIC_APM_SERVER_URL,
			environment: process.env.ELASTIC_APM_ENVIRONMENT,
			logLevel: "warn",
			captureBody: "all",
		});
	}

	public elasticLogger(): ElasticApmNode.Logger {
		return ElasticApmNode.logger;
	}
}

export { ApmService };
