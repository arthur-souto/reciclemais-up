import axios, { AxiosError } from 'axios'
import { resolveApiUrl } from '@/lib/apiUrl'
import type { SocialApiErrorResponse } from '@/types/api'

// Serviço social (posts, mídia, snapshot de usuário) é uma API separada da
// reciclemais-bff-web, mas valida o mesmo JWT (a bff-web expõe o JWKS que o
// serviço social usa para validar o token), então reaproveitamos o mesmo
// accessToken salvo no login.
export const socialApi = axios.create({
  baseURL: resolveApiUrl(import.meta.env.VITE_SOCIAL_API_URL),
  timeout: 10_000,
})

socialApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

socialApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[social-api] ${error.response.status} ${error.config?.url}`, error.response.data)
    } else if (error.request) {
      console.error('[social-api] Sem resposta do servidor', error.config?.url)
    } else {
      console.error('[social-api] Erro ao montar a requisição', error.message)
    }
    return Promise.reject(error)
  },
)

// Erros do serviço social seguem o formato default do Spring Boot
// ({ timestamp, status, error, message, path }), diferente do formato
// { code, error, dataHora } da bff-web — por isso um helper separado.
export function getSocialApiErrorMessage(error: unknown, fallback = 'Não foi possível completar a solicitação. Tente novamente.') {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.'
    }
    const data = error.response.data as SocialApiErrorResponse | undefined
    return data?.message ?? fallback
  }
  return fallback
}
