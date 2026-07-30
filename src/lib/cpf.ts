// Mesma regra de validação usada pelo backend (dígitos verificadores),
// pra dar feedback imediato no formulário de cadastro.
export function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const calcDigit = (base: string, factor: number) => {
    let total = 0
    let currentFactor = factor
    for (const digit of base) {
      total += Number(digit) * currentFactor
      currentFactor--
    }
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const digit1 = calcDigit(cpf.slice(0, 9), 10)
  const digit2 = calcDigit(cpf.slice(0, 9) + digit1, 11)

  return cpf === cpf.slice(0, 9) + digit1 + digit2
}
