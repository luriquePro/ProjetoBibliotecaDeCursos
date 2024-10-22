import { Client } from "@elastic/elasticsearch";

const elasticClient = new Client({
	node: "https://9cd5806712a74b1ba29f72d517cc381e.sa-east-1.aws.found.io:443",
	auth: {
		apiKey: {
			id: "CIIstZIBqI6fknTh2e00",
			api_key: "Cq50An7JTymOJK-fjPo_6Q",
		},
	},
});

export { elasticClient };
