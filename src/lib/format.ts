export function formatPhone(phone: string | null) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return phone
}

export function formatCep(cep: string | null) {
  if (!cep) return null
  const digits = cep.replace(/\D/g, '')
  if (digits.length === 8) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return cep
}
