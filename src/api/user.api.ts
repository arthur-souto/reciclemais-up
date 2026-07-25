import { api } from './axios'
import type { ApiItemResponse, ApiMessageResponse, ApiMutationResponse } from '@/types/api'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types/user'

export async function createUser(payload: CreateUserPayload) {
  const { data } = await api.post<ApiMutationResponse<User>>('/users', payload)
  return data.data
}

export async function getUserById(id: string) {
  const { data } = await api.get<ApiItemResponse<User>>(`/users/${id}`)
  return data.payload
}

export async function getUserByEmail(email: string) {
  const { data } = await api.get<ApiItemResponse<User>>(`/users/email/${email}`)
  return data.payload
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const { data } = await api.patch<ApiMutationResponse<User>>(`/users/${id}`, payload)
  return data.data
}

export async function deleteUser(id: string) {
  const { data } = await api.delete<ApiMessageResponse>(`/users/${id}`)
  return data
}
