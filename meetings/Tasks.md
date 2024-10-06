# Tasks

## Usuários

- [x] Cadastrar Usuário;
- [ ] Alterar Senha do Usuário;
- [x] Resetar Senha do Usuário;
- [ ] Autenticar o Usuário;
- [x] Adicionar Cache para o código de Resetar Senha do Usuario;

## Servidor

- [x] Adicionar Middleware para `RateLimit`;
- [ ] Criar função padrão para retorno de Erros;
- [ ] Fixar os `StatusCodes` em um Enum;
- [ ] Adicionar Middleware de `Autenticação`;
- [ ] Adicionar `Swagger`;

## Fluxos

### Usuários

#### Cadastrar um Usuário

- Devem ser recebidos os valores:
  - full_name `String` `Required` `Min 6` `Max 50`
  - email `String` `Required` `Min 3` `Max 3` `Unique`
  - password `String` `Required` `Min 8` `Max 8` `Need be Strong`
  - cpf `String` `Required` `Min 11` `Max 11` `Unique`
  - birth_date `String` `Required` `Min 3` `Max 3`
  - login `String` `Required` `Min 6` `Max 16` `Can't Have spaces` `Unique` `Diferent Than Email`
- Após checar unicidade dos dados, deve:
  - Criptografar a senha
  - Gerar o ID
  - Separar **First Name** do **Last Name**
  - Ajustar o Status
  - Transformar **Birth date** Para `Date`
- Deve-se retornar
  - id
  - login
  - First name
  - is_error `false`
  - message `User registered successfully`
  - status code `201`
