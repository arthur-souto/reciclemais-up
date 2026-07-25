export type UserRole = 'USER' | 'ADMIN' | 'ASSOCIATE'

export interface User {
  id: string | null
  name: string
  email: string
  cpf: string
  role: UserRole
}

export interface CreateUserPayload {
  name: string
  email: string
  cpf: string
  password: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  cpf?: string
}
