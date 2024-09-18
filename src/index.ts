import { server } from "./server.ts";

const PORT = 3333;

const IS_TEST_AMBIENT = process.env.NODE_ENV === "test";

if (!IS_TEST_AMBIENT) {
	server.listen(PORT, () => {
		console.log(`Servidor iniciado na url: http://localhost:${PORT}.`);
	});
}
