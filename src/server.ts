import { app } from "./app.ts";

const PORT = Number(process.env.PORT!);
const IS_TEST_AMBIENT = process.env.NODE_ENV === "TEST";

if (!IS_TEST_AMBIENT) {
	app.listen({ port: PORT }, () => {
		console.log(`Servidor iniciado na url: http://localhost:${PORT}.`);
	});
}
