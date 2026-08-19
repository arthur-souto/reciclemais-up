import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyInformation, socialLogIn, whoAmI } from '@/api/socialAuth.api'

export const socialAuthKeys = {
  myInformation: ['social', 'my-information'] as const,
  whoAmI: ['social', 'whoami'] as const,
}

export function useSocialLogIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: socialLogIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialAuthKeys.myInformation })
    },
  })
}

export function useMyInformation(enabled = true) {
  return useQuery({
    queryKey: socialAuthKeys.myInformation,
    queryFn: getMyInformation,
    enabled,
  })
}

export function useWhoAmI(enabled = true) {
  return useQuery({
    queryKey: socialAuthKeys.whoAmI,
    queryFn: whoAmI,
    enabled,
  })
}
