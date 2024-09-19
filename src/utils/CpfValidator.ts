const CpfValidator = (cpf: string): boolean => {
  // Testa se é uma sequencia de digitos repetidos]
  const todosDigitosRepetidos = /^(\d)\1{10}$/.test(cpf);
  if (todosDigitosRepetidos || cpf.length !== 11) {
    return false;
  }

  // Primeiro Digito confirmador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let primeiroDigito = (soma * 10) % 11;
  if (primeiroDigito === 10) {
    primeiroDigito = 0;
  }

  if (primeiroDigito !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Segundo Digito confirmador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  let segundoDigito = (soma * 10) % 11;
  if (segundoDigito === 10) {
    segundoDigito = 0;
  }

  if (segundoDigito !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
};

export { CpfValidator };
