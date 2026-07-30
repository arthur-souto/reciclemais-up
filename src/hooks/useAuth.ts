import { useMutation } from '@tanstack/react-query'
import { login } from '@/api/auth.api'
import { getUserById } from '@/api/user.api'
import type { LoginPayload } from '@/types/auth'
import { useAuthContext } from '@/context/AuthContext'
import { decodeJwt } from '@/lib/jwt'

interface AccessTokenPayload {
  sub: string
}

export function useLogin() {
  const { login: setSession } = useAuthContext()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { accessToken } = await login(payload)
      // O interceptor do axios lê o token do localStorage, então ele precisa
      // estar salvo antes desta chamada autenticada, e não só em onSuccess.
      localStorage.setItem('accessToken', accessToken)
      try {
        // Não existe endpoint /me: o id do usuário logado vem do claim "sub" do JWT.
        const claims = decodeJwt<AccessTokenPayload>(accessToken)
        if (!claims?.sub) {
          throw new Error('Não foi possível identificar o usuário autenticado.')
        }
        const user = await getUserById(claims.sub)
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
