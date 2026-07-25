import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPrize, deletePrize, getPrizeById, getPrizes, updatePrize } from '@/api/prize.api'
import type { CreatePrizePayload, UpdatePrizePayload } from '@/types/prize'

export const prizeKeys = {
  all: ['prizes'] as const,
  detail: (id: number) => [...prizeKeys.all, id] as const,
}

export function usePrizes() {
  return useQuery({
    queryKey: prizeKeys.all,
    queryFn: getPrizes,
  })
}

export function usePrize(id: number) {
  return useQuery({
    queryKey: prizeKeys.detail(id),
    queryFn: () => getPrizeById(id),
    enabled: !!id,
  })
}

export function useCreatePrize() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePrizePayload) => createPrize(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prizeKeys.all })
    },
  })
}

export function useUpdatePrize(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePrizePayload) => updatePrize(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prizeKeys.all })
      queryClient.invalidateQueries({ queryKey: prizeKeys.detail(id) })
    },
  })
}

export function useDeletePrize() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePrize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prizeKeys.all })
    },
  })
}
