import { useMutation } from '@tanstack/react-query'
import { login } from '@/api/auth.api'
import { getUserByEmail } from '@/api/user.api'
import type { LoginPayload } from '@/types/auth'
import { useAuthContext } from '@/context/AuthContext'

export function useLogin() {
  const { login: setSession } = useAuthContext()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { accessToken } = await login(payload)
      // O interceptor do axios lê o token do localStorage, então ele precisa
      // estar salvo antes desta chamada autenticada, e não só em onSuccess.
      localStorage.setItem('accessToken', accessToken)
      try {
        const user = await getUserByEmail(payload.email)
        return { accessToken, user }
      } catch (error) {
        localStorage.removeItem('accessToken')
        throw error
      }
    },
    onSuccess: ({ accessToken, user }) => {
      setSession(accessToken, user)
    },
  })
}

export function useLogout() {
  const { logout } = useAuthContext()
  return logout
}
