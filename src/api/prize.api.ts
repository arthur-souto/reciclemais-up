import { api } from './axios'
import type { ApiItemResponse, ApiListResponse, ApiMessageResponse, ApiMutationResponse } from '@/types/api'
import type { CreatePrizePayload, Prize, UpdatePrizePayload } from '@/types/prize'

export async function createPrize(payload: CreatePrizePayload) {
  const { data } = await api.post<ApiMutationResponse<Prize>>('/prizes', payload)
  return data.data
}

export async function getPrizes() {
  const { data } = await api.get<ApiListResponse<Prize>>('/prizes')
  return data.payload
}

export async function getPrizeById(id: number) {
  const { data } = await api.get<ApiItemResponse<Prize>>(`/prizes/${id}`)
  return data.payload
}

export async function updatePrize(id: number, payload: UpdatePrizePayload) {
  const { data } = await api.patch<ApiMutationResponse<Prize>>(`/prizes/${id}`, payload)
  return data.data
}

export async function deletePrize(id: number) {
  const { data } = await api.delete<ApiMessageResponse>(`/prizes/${id}`)
  return data
}
