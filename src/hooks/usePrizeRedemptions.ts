import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyRedemptions, getPrizeRedemptions, redeemPrize } from '@/api/prizeRedemption.api'
import { prizeKeys } from '@/hooks/usePrizes'
import { userKeys } from '@/hooks/useUsers'
import { useAuthContext } from '@/context/AuthContext'
import type { PaginationParams } from '@/types/api'

export const prizeRedemptionKeys = {
  all: ['prizeRedemptions'] as const,
  me: (params: PaginationParams) => [...prizeRedemptionKeys.all, 'me', params] as const,
  byPrize: (prizeId: number, params: PaginationParams) =>
    [...prizeRedemptionKeys.all, 'prize', prizeId, params] as const,
}

export function useMyRedemptions(params: PaginationParams = {}) {
  return useQuery({
    queryKey: prizeRedemptionKeys.me(params),
    queryFn: () => getMyRedemptions(params),
  })
}

export function usePrizeRedemptions(prizeId: number, params: PaginationParams = {}) {
  return useQuery({
    queryKey: prizeRedemptionKeys.byPrize(prizeId, params),
    queryFn: () => getPrizeRedemptions(prizeId, params),
    enabled: !!prizeId,
  })
}

export function useRedeemPrize() {
  const queryClient = useQueryClient()
  const { user } = useAuthContext()

  return useMutation({
    mutationFn: (prizeId: number) => redeemPrize(prizeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prizeKeys.all })
      queryClient.invalidateQueries({ queryKey: prizeRedemptionKeys.all })
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(user.id) })
      }
    },
  })
}
