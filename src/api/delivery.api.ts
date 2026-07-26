import { api } from './axios'
import type {
  ApiItemResponse,
  ApiListResponse,
  ApiMessageResponse,
  ApiMutationResponse,
  PaginationParams,
} from '@/types/api'
import type { CreateDeliveryPayload, Delivery, UpdateDeliveryPayload } from '@/types/delivery'

export async function createDelivery(payload: CreateDeliveryPayload) {
  const { data } = await api.post<ApiMutationResponse<Delivery>>('/deliveries', payload)
  return data.data
}

export async function getDeliveries(params?: PaginationParams) {
  const { data } = await api.get<ApiListResponse<Delivery>>('/deliveries', { params })
  return data
}

export async function getDeliveryById(id: number) {
  const { data } = await api.get<ApiItemResponse<Delivery>>(`/deliveries/${id}`)
  return data.payload
}

export async function updateDelivery(id: number, payload: UpdateDeliveryPayload) {
  const { data } = await api.patch<ApiMutationResponse<Delivery>>(`/deliveries/${id}`, payload)
  return data.data
}

export async function deleteDelivery(id: number) {
  const { data } = await api.delete<ApiMessageResponse>(`/deliveries/${id}`)
  return data
}
