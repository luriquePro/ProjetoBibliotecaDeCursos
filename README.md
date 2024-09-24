# Projeto ADA

## Índice

- [Licença](#licenca)
- [Funcionalidades](#funcionalidades)
- [Estrutura](#estrutura)
- [Como rodar o projeto?](#como-rodar-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Autores](#autores)
- [Próximas Features Planejadas](#próximas-features-planejadas)

## Licença

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🖥️ Funcionalidades

- [ ] Usuários ✅
  - [x] Cadastrar Usuário ✅
  - [ ] Resetar Senha ⚠️
  - [ ] Autenticar ❌

## 📒 Estrutura

### Informações Gerais

No backend do projeto ADA, todas as funcionalidades seguem os princípios de **Injeção de Dependências** e **SOLID**, garantindo uma separação clara de
responsabilidades entre as camadas do sistema. Isso promove um código mais modular, testável e fácil de manter.

- **Injeção de Dependências**: Todas as dependências são injetadas no momento da criação de classes ou funções, tornando o código flexível e
  desacoplado. Isso facilita testes e a troca de implementações, como no uso de diferentes serviços.
- **Nomes Autoexplicativos**: Variáveis e funções têm nomes que refletem claramente seu propósito, promovendo clareza e simplicidade.

### Padrão de Camadas e Dependências

No projeto, a separação entre camadas e dependências segue os princípios do SOLID:

1. **Rota**:

   - A rota define o ponto de entrada e chama o **Controller** apropriado. Ela nunca acessa diretamente outros serviços, como **Models**, **Services**
     ou **Repositories**.
   - **Exemplo de rota**:
     ```ts
     POST / users / register;
     ```

2. **Controller**:

   - O **Controller** lida com a solicitação HTTP e interage com os **Services**. Ele nunca acessa diretamente uma **Rota** ou **Model**.
   - **Exemplo de Controller**:
     ```ts
     class UsuarioController {
     	async cadastrar(req, res) {
     		const { nome, email, senha } = req.body;
     		await usuarioService.cadastrar({ nome, email, senha });
     		res.status(201).send({ message: "Usuário cadastrado com sucesso!" });
     	}
     }
     ```

3. **Service**:

   - Os **Services** contêm a lógica de negócio da aplicação. Eles podem acessar **Providers** (serviços de terceiros), **Repositories** ou outros
     **Services**, mas nunca devem acessar diretamente **Models**, **Controllers** ou **Rotas**.
   - **Exemplo de Service**:
     ```ts
     class UsuarioService {
     	async cadastrar(dadosUsuario) {
     		// Lógica de negócio e chamada ao repositório
     		await usuarioRepository.salvar(dadosUsuario);
     	}
     }
     ```

4. **Repository**:

   - Os **Repositories** são responsáveis pela interação com o banco de dados, manipulando os **Models**. Eles não podem acessar **Services**,
     **Controllers**, **Routes** ou **Providers**.
   - **Exemplo de Repository**:
     ```ts
     class UsuarioRepository {
     	async salvar(dadosUsuario) {
     		const novoUsuario = new UsuarioModel(dadosUsuario);
     		return await novoUsuario.save();
     	}
     }
     ```

5. **Model**:

   - O **Model** representa a estrutura dos dados e as regras de validação no banco. Ele nunca acessa outros componentes, como **Repositories**,
     **Services**, **Controllers** ou **Routes**.
   - **Exemplo de Model**:

     ```ts
     const UsuarioSchema = new mongoose.Schema({
     	nome: { type: String, required: true },
     	email: { type: String, required: true },
     	senha: { type: String, required: true },
     });

     const UsuarioModel = mongoose.model("Usuarios", UsuarioSchema);
     ```

---

### Definir Model

Para definir um **Model**, será necessário primeiro criar uma interface para a entidade, normalmente chamada de `IIndexDTO`.

Você precisará criar uma Interface para o Schema da entidade chamada de `IIndexMongo`.

Para evitar conflitos do ID do documento do Mongo, remova ele usando o **Omit** do TypeScript.

Por padrão, o nome da `Collection` será no plural.

Todas as collections devem ter o status, que será definido por um _Enum_ dentro da pasta `Constants`.

Siga o exemplo abaixo:

---

**_.src/interfaces/IndexInterface.ts_**

```ts
import { INDEX_STATUS } from "../constants/INDEX.ts";

export interface IIndexDTO {
	id: string;
	name: string;
	status: INDEX_STATUS;
}
```

---

**_.src/constants/INDEX.ts_**

```ts
export enum INDEX_STATUS {
	ACTIVE = "ACTIVE",
	DELETED = "DELETED",
}
```

---

**_.src/models/Index.ts_**

```ts
import { Schema, model, Document } from "mongoose";
import { IIndexDTO } from "../interfaces/IndexInterface.ts";
import { v4 } from "uuid";

export interface IIndexMongo extends Partial<Omit<Document, "id">>, IIndexDTO {}

const IndexSchema = new Schema<IIndexMongo>(
	{
		id: {
			type: String,
			required: true,
			trim: true,
			index: true,
			unique: true,
			// default: v4() #Não estou usando para não me prender a lib do uuid. Caso um dia eu deseje trocar, isso não irá me afetar
		},
		name: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		status: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
	},
	{ timestamps: true },
);

export const IndexModel = model<IIndexMongo>("indexs", IndexSchema);
```

---

### Definir Repositorio

Para definir um repositório, você precisará fazer a injeção da dependência do Model.

A injeção é feita de forma automática pelo construtor usando a sintaxe:

```bash
constructor(visibilidade readonly nomeDaDependencia: InterfaceDaDependencia){}

```

Siga o exemplo abaixo:

---

**_.src/repositories/IndexRepository.ts_**

```ts
import { Model } from "mongoose";
import { IIndexMongo } from "../models/Index.ts";
import { IIndexDTO, IIndexFind, IIndexRepository } from "../interfaces/IndexInterface.ts";

class IndexRepository implements IIndexRepository {
	constructor(private readonly indexModel: Model<IIndexMongo>) {}
	public async findOneByObj(filter: IIndexFind): Promise<IIndexDTO | null> {
		const result = await this.indexModel.findOne(filter);
		return result;
	}
}

export { IndexRepository };
```

---

**_.src/interfaces/IndexInterface.ts_**

```ts
import { INDEX_STATUS } from "../constants/INDEX.ts";

// Data to set Model
export interface IIndexDTO {
	id: string;
	name: string;
	status: INDEX_STATUS;
}

// Data filter
export interface IIndexFind {
	id?: string | { $in: string[] };
	name?: string | { $in: string[] };
	status?: INDEX_STATUS | { $in: INDEX_STATUS[] } | { $ne: INDEX_STATUS };
}

// Repository
export interface IIndexRepository {
	findOneByObj(filter: IIndexFind): Promise<IIndexDTO | null>;
}
```

---

### Definir Services

Os services são onde ficará toda a lógica de negócio. Toda a regra de negócio fica dentro dele.

Um padrão usado em todos os retornos é um objeto que sempre terá dois parâmetros:

```ts
{
	status_code: number,
	is_error: boolean
}

```

O repositório será por injeção, igual ao model foi no repositório.

Terá uma segunda injeção opcional, que será a de Validations. Essa classe é responsável por fazer toda a validação YUP necessária pelo método.

---

**_.src/services/IndexService.ts_**

```ts
import { IIndexRepository, IIndexValidations, IMessageReturn } from "../interfaces/IndexInterface.ts";

export class IndexService {
	constructor(
		private readonly indexValidations: IIndexValidations,
		private readonly indexRepository: IIndexRepository,
	) {}
	public async index(name?: string): Promise<IMessageReturn> {
		await this.indexValidations.index({ name });
		const result = await this.indexRepository.findOneByObj({ name });
		return { message: `Hello, ${result?.name ?? "World"}!`, is_error: false, statusCode: 200 };
	}
}
```

---

**_.src/interfaces/IndexInterface.ts_**

```ts
import { INDEX_STATUS } from "../constants/INDEX.ts";

// Data to set Model
export interface IIndexDTO {
	id: string;
	name: string;
	status: INDEX_STATUS;
}

// Data filter
export interface IIndexFind {
	id?: string | { $in: string[] };
	name?: string | { $in: string[] };
	status?: INDEX_STATUS | { $in: INDEX_STATUS[] } | { $ne: INDEX_STATUS };
}

// Repository
export interface IIndexRepository {
	findOneByObj(filter: IIndexFind): Promise<IIndexDTO | null>;
}

// Service
export interface IIndexService {
	index(name?: string): Promise<IMessageReturn>;
}

// Default Return
export interface IMessageReturn {
	message: string;
	is_error: boolean;
	statusCode: number;
}
```

### Definir Validations

Na classe `Validations`, toda validação é realizada, e normalmente é a primeira chamada do método. A estrutura de validação consiste em dois objetos
principais:

- **dataValidation**:
  - Objeto contendo os valores a serem validados.
- **shapeValidation**:
  - Objeto que define o schema de validação com `YUP`.

A validação final é realizada por uma função utilitária padrão da pasta **Utils**, chamada `YupValidator`.

---

**_.src/validations/IndexValidations.ts_**

```ts
import * as yup from "yup";
import { YupValidator } from "../utils/YupValidator.ts";
import { IIndexValidations } from "../interfaces/IndexInterface.ts";

class IndexValidations implements IIndexValidations {
	public async index({ name }: { name?: string }) {
		const dataValidation = { name };
		const shapeValidation = { name: yup.string() };

		await YupValidator(shapeValidation, dataValidation);
	}
}

export { IndexValidations };
```

---

**_.src/interfaces/IndexInterface.ts_**

```ts
import { INDEX_STATUS } from "../constants/INDEX.ts";

// Data to set Model
export interface IIndexDTO {
	id: string;
	name: string;
	status: INDEX_STATUS;
}

// Data filter
export interface IIndexFind {
	id?: string | { $in: string[] };
	name?: string | { $in: string[] };
	status?: INDEX_STATUS | { $in: INDEX_STATUS[] } | { $ne: INDEX_STATUS };
}

// Repository
export interface IIndexRepository {
	findOneByObj(filter: IIndexFind): Promise<IIndexDTO | null>;
}

// Service
export interface IIndexService {
	index(name?: string): Promise<IMessageReturn>;
}

// Validations
export interface IIndexValidations {
	index(dataValidation: { name?: string }): Promise<void>;
}

// Default Return
export interface IMessageReturn {
	message: string;
	is_error: boolean;
	statusCode: number;
}
```

---

### Definir Utils

A pasta `Utils` contém funções auxiliares que podem ser usadas em várias partes do projeto. A única regra para essa pasta é que cada função deve ser
mantida em um arquivo separado.

Aqui está a função `YupValidator`, que valida os dados com base no schema YUP fornecido:

---

**_.src/utils/YupValidator.ts_**

```ts
import * as yup from "yup";
import { AppError } from "../shared/errors/AppError.ts";

const YupValidator = async (dataShape: yup.AnyObject, dataValidation: object) => {
	try {
		const schema = yup.object().shape(dataShape);
		await schema.validate(dataValidation);
	} catch (error: any) {
		throw new AppError(error.message, 400);
	}
};

export { YupValidator };
```

### Definir Controllers

Os **Controllers** são responsáveis por receber as requisições _HTTP_ e delegar o processamento para os serviços adequados. Eles nunca devem conter
lógica de negócio; seu papel é simplesmente orquestrar a comunicação entre as rotas e os serviços.

No exemplo abaixo, o `IndexController` recebe uma requisição, extrai os parâmetros da query, e utiliza um serviço (`indexService`) para processar a
lógica de negócio. O retorno do serviço é enviado de volta ao cliente em formato JSON, com o código de status apropriado.

Por padrão todo controller deve retornar o statusCode do seu service, e a sua response deve ser um objeto json.

Sempre haverá o campo `is_error`.

---

**_.src/controllers/IndexController.ts_**

```ts
import { Request, Response } from "express";
import { IIndexService } from "../interfaces/IndexInterface.ts";

export class IndexController {
	constructor(private readonly indexService: IIndexService) {}
	public async index(request: Request, response: Response) {
		const revere = request.query.revere as string | undefined;

		const { is_error, message, status_code } = await this.indexService.index(revere);

		response.status(status_code);
		return response.json({ message, is_error });
	}
}
```

### Definir Rotas

Nas rotas que ficarão todas as injeções de dependência.

Sempre use o bind para referenciar o `this` ao controller.

```bash
	.bind(indexController)
```

---

**_.src/routes/IndexRoutes.ts_**

```ts
import { Router } from "express";

import { IndexService } from "./../services/IndexService.ts";
import { IndexController } from "../controllers/IndexController.ts";
import { IndexValidations } from "../validations/IndexValidations.ts";
import { IndexRepository } from "../repositories/IndexRepository.ts";
import { IndexModel } from "../models/Index.ts";

const indexValidations = new IndexValidations();
const indexRepository = new IndexRepository(IndexModel);
const indexService = new IndexService(indexValidations, indexRepository);
const indexController = new IndexController(indexService);

const IndexRoutes = Router();

IndexRoutes.get("/", indexController.index.bind(indexController));

export { IndexRoutes };
```

---

**_.src/routes.ts_**

```ts
import { Router } from "express";
import { IndexRoutes } from "./routes/IndexRoutes.ts";

const routes = Router();

routes.use("/", IndexRoutes);

export { routes };
```

O primeiro parâmetro recebido pelo `routes.use()` é o grupo das rotas. Ao informar uma barra, é possível acessar a rota pelo caminho

```ts
	GET {{url}} /
```

Caso eu coloque um grupo `home`.

```ts
import { Router } from "express";
import { IndexRoutes } from "./routes/IndexRoutes.ts";

const routes = Router();

routes.use("/home", IndexRoutes);

export { routes };
```

Neste caso, seria acessado pela rota

```ts
	GET {{url}} / home
	GET {{url}} / home /
```

#### Pontos-chave:

- As rotas devem conter todas as injeções de dependência necessárias.
- O uso do bind para referenciar o this ao controlador é uma boa prática.
- É possível organizar as rotas em grupos usando o método use() da Router.
- O primeiro parâmetro do use() define o grupo das rotas.
- O acesso às rotas pode ser feito através do grupo definido ou da barra raiz ("/").

#### Melhores práticas:

- Mantenha uma estrutura clara e organizada para suas rotas.
- Utilize injeção de dependência para gerenciar instâncias de serviços e controladores.
- Use o bind() para garantir que o contexto correto seja mantido ao chamar métodos de controladores.
- Organize suas rotas em grupos lógicos para melhor manutenção e escalabilidade do código.
- Considere usar nomes descritivos para os grupos das rotas, como "home", "users", etc., para facilitar a navegação e compreensão do aplicativo.

---

### Definir Middlewares

### Definir Shared

## Como rodar o projeto?

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Git](https://git-scm.com),
[Node.js](https://nodejs.org/en/). Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).

### 🎲 Rodando o Back End (servidor)

```bash
# Clone este repositório
$ git clone <https://github.com/luriquePro/projeto-ada>

# Acesse a pasta do projeto no terminal/cmd
$ cd projeto-ada

# Instale as dependências
$ npm install

# Crie um .env
$ touch .env

# Coloque os valores de .env.example em .env
$ cp .env.example .env

# Ajustar a versão do nodejs
$ nvm i

# Execute os testes
$ npm run test
$ npm run test:dev
$ npm run test:debug

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# Execute a aplicação em modo de produção
$ npm run build
$ npm run start


# O servidor inciará na porta:3333 - acesse <http://localhost:3333>
```

## 🛠 Tecnologias ultilziadas

- [Nodejs 20.17](https://nodejs.org/pt/download/package-manager)
- [Typescript 5.6](https://www.typescriptlang.org/)
- [Express 4.21](https://expressjs.com/pt-br/)
- [Moment 2.3](https://momentjs.com/)
- [Mongoose 8.6](https://mongoosejs.com/)
- [MD5 2.3](https://github.com/pvorb/node-md5)
- [Eslint 8.57](https://eslint.org/)
- [Prettier 3.3](https://prettier.io/)
- [NTL 5.1](https://github.com/ruyadorno/ntl)
- [Jest 29.7](https://jestjs.io/pt-BR/)

## Próximas features Planejadas

- [ ] CRUD de cursos ⚠️

## 👨‍💻 Autores

- [Luiz](http://www.google.com.br)
