import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registerEvidence } from '@/api/evidence.api'
import { deliveryKeys } from '@/hooks/useDeliveries'

export function useRegisterEvidence() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ deliveryId, file }: { deliveryId: number; file: File }) =>
      registerEvidence(deliveryId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.all })
    },
  })
}
