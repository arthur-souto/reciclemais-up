import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDelivery, deleteDelivery, getDeliveryById, getDeliveries, updateDelivery } from '@/api/delivery.api'
import type { CreateDeliveryPayload, UpdateDeliveryPayload } from '@/types/delivery'
import type { PaginationParams } from '@/types/api'

export const deliveryKeys = {
  all: ['deliveries'] as const,
  list: (params: PaginationParams) => [...deliveryKeys.all, 'list', params] as const,
  detail: (id: number) => [...deliveryKeys.all, id] as const,
}

export function useDeliveries(params: PaginationParams = {}) {
  return useQuery({
    queryKey: deliveryKeys.list(params),
    queryFn: () => getDeliveries(params),
  })
}

export function useDelivery(id: number) {
  return useQuery({
    queryKey: deliveryKeys.detail(id),
    queryFn: () => getDeliveryById(id),
    enabled: !!id,
  })
}

export function useCreateDelivery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDeliveryPayload) => createDelivery(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}

export function useUpdateDelivery(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateDeliveryPayload) => updateDelivery(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
      queryClient.invalidateQueries({ queryKey: deliveryKeys.detail(id) })
    },
  })
}

export function useDeleteDelivery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteDelivery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}
