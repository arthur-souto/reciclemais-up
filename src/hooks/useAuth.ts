import { useMutation } from '@tanstack/react-query'
import { login } from '@/api/auth.api'
import type { LoginPayload } from '@/types/auth'
import { useAuthContext } from '@/context/AuthContext'

export function useLogin() {
  const { login: setAccessToken } = useAuthContext()

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
    },
  })
}

export function useLogout() {
  const { logout } = useAuthContext()
  return logout
}
