import { UserModel } from "./models/User.ts";
import { UserRepository } from "./repositories/UserRepository.ts";
import { app } from "./server.ts";
import { UserService } from "./services/UserSevice.ts";
import { UserValidations } from "./validations/UserValidations.ts";

const PORT = Number(process.env.PORT!);
const IS_TEST_AMBIENT = process.env.NODE_ENV === "TEST";

if (!IS_TEST_AMBIENT) {
	app.listen({ port: PORT }, () => {
		console.log(`Servidor iniciado na url: http://localhost:${PORT}.`);
	});

	// const userDTO = {
	// 	full_name: "Luiz Henrique Dos Santos Gonzaga",
	// 	email: "luiz.prog.henri@gmail.com",
	// 	password: "Xandy1011!",
	// 	cpf: "71079969403",
	// 	birth_date: "2004-03-06T03:00:00.000Z",
	// 	login: "lurique",
	// };

	// const userService = new UserService(new UserValidations(), new UserRepository(UserModel));
	// userService.registerUser(userDTO).then(data => {
	// 	console.log(data);
	// });
}
