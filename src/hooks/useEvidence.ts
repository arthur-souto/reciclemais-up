import { useMutation } from '@tanstack/react-query'
import { registerEvidence } from '@/api/evidence.api'

export function useRegisterEvidence() {
  return useMutation({
    mutationFn: (file: File) => registerEvidence(file),
  })
}
