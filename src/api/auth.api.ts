import { api } from './axios'
import type { LoginPayload, LoginResponse } from '@/types/auth'

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}
