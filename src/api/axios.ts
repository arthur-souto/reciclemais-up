import axios, { AxiosError } from 'axios'
import { resolveApiUrl } from '@/lib/apiUrl'
import type { ApiErrorResponse } from '@/types/api'

export const api = axios.create({
  baseURL: resolveApiUrl(import.meta.env.VITE_API_URL),
  timeout: 10_000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[api] ${error.response.status} ${error.config?.url}`, error.response.data)
    } else if (error.request) {
      console.error('[api] Sem resposta do servidor', error.config?.url)
    } else {
      console.error('[api] Erro ao montar a requisição', error.message)
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error: unknown, fallback = 'Não foi possível completar a solicitação. Tente novamente.') {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.'
    }
    const data = error.response.data as ApiErrorResponse | undefined
    return data?.error ?? fallback
  }
  return fallback
}
