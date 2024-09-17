# Criação do Servidor

## Estrutura de Arquivos e Pastas:

- [ ] **routes** (Rotas)
- [ ] **services** (Serviços)
- [ ] **entities** (Entidades)
- [ ] **controllers** (Controladores)
- [ ] **repositories** (Repositórios)
- [ ] **server.js** (Arquivo principal do servidor)
- [ ] **index.js** (Arquivo de entrada principal, se aplicável)

## Descrição dos Arquivos e Pastas:

- **routes**:

  - Arquivo(s) para definir as rotas da aplicação.
  - Exemplo: `routes/userRoutes.js` para rotas relacionadas a usuários.
  - Descrição: Define as rotas e vincula os controladores.

- **services**:

  - Arquivo(s) para definir a lógica de negócios e comunicação com a camada de dados.
  - Exemplo: `services/userService.js` para serviços relacionados a usuários.
  - Descrição: Implementa a lógica de negócios e interage com a camada de dados.

- **entities**:

  - Arquivo(s) para definir as entidades e modelos de dados.
  - Exemplo: `entities/user.js` para a entidade de usuário.
  - Descrição: Define os modelos e estruturas de dados.

- **controllers**:

  - Arquivo(s) para controlar a lógica da aplicação e manipular as requisições HTTP.
  - Exemplo: `controllers/userController.js` para controladores relacionados a usuários.
  - Descrição: Gerencia as requisições e respostas HTTP.

- **repositories**:

  - Arquivo(s) para gerenciar a comunicação com o banco de dados.
  - Exemplo: `repositories/userRepository.js` para operações de banco de dados relacionadas a usuários.
  - Descrição: Implementa as operações CRUD e outras interações com o banco de dados.

- **server.js**:

  - Arquivo principal que inicializa o servidor e configura middlewares.
  - Descrição: Configura o servidor, middlewares e rotas.

- **index.js**:
  - Arquivo de entrada principal, se aplicável, para inicializar a aplicação.
  - Descrição: Pode servir como ponto de entrada para a aplicação.

## Validações e Estrutura:

- [ ] **Rotas**:

  - Definir rotas para todas as operações CRUD.
  - As rotas devem ser modularizadas e organizadas por recurso.

- [ ] **Serviços**:

  - Implementar lógica de negócios com tratamento de erros.
  - Os serviços devem ser testados para garantir que a lógica está correta.

- [ ] **Entidades**:

  - Definir as entidades com validação de dados, se necessário.
  - Implementar a integração com o banco de dados.

- [ ] **Controladores**:

  - Implementar métodos para lidar com requisições e retornar respostas apropriadas.
  - Garantir que os controladores tratem exceções e erros de forma adequada.

- [ ] **Repositories**:

  - Implementar métodos para acesso e manipulação dos dados.
  - Garantir a conexão com o banco de dados e tratamento de erros.

- [ ] **server.js**:

  - Configurar o servidor HTTP (ex: Express).
  - Configurar middlewares (ex: body-parser, CORS).
  - Definir a porta e iniciar o servidor.

- [ ] **index.js**:
  - Iniciar a aplicação, se usado como ponto de entrada.
  - Importar e configurar o servidor e rotas.

## Fluxo de Desenvolvimento:

- [ ] Configurar ambiente de desenvolvimento e dependências.
- [ ] Criar estrutura básica de arquivos e pastas.
- [ ] Implementar rotas, serviços, entidades, controladores e repositórios.
- [ ] Configurar e iniciar o servidor.
- [ ] Testar a aplicação para garantir que todas as partes estão funcionando corretamente.
- [ ] Documentar a API e a estrutura do servidor.
- [ ] Configurar whitelist de IPs, se necessário.
- [ ] Aplicar variáveis de ambiente com `.env` para configuração sensível.

## Tasks

- #01 [ ] Iniciar Servidor na Porta `3000`
- #02 [ ] Configurar Rotas
- #03 [ ] Configurar Controllers
- #04 [ ] Linkar Controllers nos Services
- #05 [ ] Criar arquivo padrão de Classes [`Controllers`, `Services` e `Entities`]
- #06 [ ] Adicionar possibilidade de queries pelas rotas
