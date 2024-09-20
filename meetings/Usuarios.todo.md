# Register a user

## Expected Fields:

- [ ] Name
- [ ] Email
- [ ] Password
- [ ] CPF
- [ ] Date of Birth
- [ ] Login (nome de usuário)

## Field Validations:

- [ ] **Name**:
  - Mínimo de 3 caracteres
  - Apenas caracteres alfabéticos permitidos (A-Z, a-z)
  - Sem caracteres especiais ou números
  - Máximo de 50 caracteres
- [ ] **Email**:
  - Deve seguir o formato de email válido (ex: `example@domain.com`)
  - Deve ser único no sistema
  - Máximo de 100 caracteres
- [ ] **Password**:
  - Mínimo de 8 caracteres
  - Deve incluir pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (ex: @, #, $)
  - Máximo de 16 caracteres
- [ ] **Date of Birth**:
  - Deve ser uma data válida (formato DD/MM/YYYY)
  - Usuário deve ter pelo menos 18 anos
  - Não deve ser uma data futura
- [ ] **CPF**:
  - Deve seguir o formato válido de CPF (XXX.XXX.XXX-XX) Ou (XXXXXXXXXXX)
  - Deve ser único no sistema
  - Deve passar na validação de dígitos do CPF
    - Deve salvar sem simbolos especiais (XXXXXXXXXXX)
- [ ] **Login**:
  - Mínimo de 4 caracteres
  - Apenas caracteres alfanuméricos permitidos (A-Z, a-z, 0-9)
  - Sem espaços ou caracteres especiais
  - Deve ser único no sistema
  - Máximo de 20 caracteres

## Flow:

- [ ] Usuário navega até a página de cadastro
- [ ] Usuário preenche todos os campos obrigatórios
- [ ] Validação dos campos ocorre no lado do cliente
- [ ] Submissão do formulário aciona validação no lado do servidor
- [ ] Submissões bem-sucedidas são armazenadas no banco de dados
- [ ] Usuário é redirecionado para uma página de sucesso ou página de login

## Return Messages:

- [ ] **Success**: "Cadastro realizado com sucesso. Verifique seu e-mail para confirmar sua conta."
- [ ] **Error**: Exibir mensagens de erro para campos inválidos ou falhas na submissão
  - Formato de email inválido
  - Senha fraca
  - CPF já cadastrado
  - Nome de usuário já utilizado
  - Campos obrigatórios faltando

## Test Cases:

- [ ] **Valid Input**: Todos os campos preenchidos corretamente, cadastro é bem-sucedido
- [ ] **Duplicate Email**: Email já está em uso, cadastro falha
- [ ] **Weak Password**: Senha não atende aos requisitos de complexidade
- [ ] **Invalid CPF**: CPF não é válido (falha na verificação ou formato incorreto)
- [ ] **Underage User**: Usuário com menos de 18 anos, cadastro falha
- [ ] **Invalid Login**: Login (nome de usuário) contém caracteres especiais ou é muito curto
- [ ] **Missing Required Fields**: Um ou mais campos obrigatórios estão vazios

## Negative Cases:

- [ ] Negar cadastro para usuários com menos de 18 anos
- [ ] Negar cadastro com CPF, email ou login duplicados
- [ ] Negar formato de email inválido
- [ ] Negar senhas fracas que não atendem aos critérios
- [ ] Negar datas de nascimento inválidas (datas futuras)
- [ ] Negar login inválido (ex: login com espaços ou caracteres especiais)
- [ ] Negar campos obrigatórios vazios (Name, Email, Password, Date of Birth, CPF, Login)

## Tasks:

- [x] | #01 | Registrar um Usuario
  - Criar validação para registrar um usuario
  - Criar o Service para registrar um Usuario
  - Criar Model e Repository do Usuario
  - Criar Route e Controller
