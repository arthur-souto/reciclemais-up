import { api } from './axios'
import type { ApiListResponse, ApiMutationResponse, PaginationParams } from '@/types/api'
import type { PrizeRedemption } from '@/types/prizeRedemption'

export async function redeemPrize(prizeId: number) {
  const { data } = await api.post<ApiMutationResponse<PrizeRedemption>>(`/prizes/${prizeId}/redeem`)
  return data.data
}

export async function getMyRedemptions(params?: PaginationParams) {
  const { data } = await api.get<ApiListResponse<PrizeRedemption>>('/prizes/redemptions/me', { params })
  return data
}

export async function getPrizeRedemptions(prizeId: number, params?: PaginationParams) {
  const { data } = await api.get<ApiListResponse<PrizeRedemption>>(`/prizes/${prizeId}/redemptions`, { params })
  return data
}
