export type UserRole = 'USER' | 'ADMIN' | 'ASSOCIATE'

export interface User {
  id: string | null
  name: string
  email: string
  cpf: string
  role: UserRole
  profile_image: string | null
  phone: string | null
  cep: string | null
  address: string | null
  total_score: number
  created_at: string
  updated_at: string
}

export interface CreateUserPayload {
  name: string
  email: string
  cpf: string
  password: string
  profile_image?: string
  phone?: string
  cep?: string
  address?: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  cpf?: string
  profile_image?: string
  phone?: string
  cep?: string
  address?: string
}
