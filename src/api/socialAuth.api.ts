import { socialApi } from './socialAxios'
import type { UserSnapshot, UserSnapshotCreatedResponse, WhoAmIResponse } from '@/types/userSnapshot'

export async function whoAmI() {
  const { data } = await socialApi.get<WhoAmIResponse>('/v1/auth/context/whoami')
  return data
}

// Cria (se não existir) ou retorna o snapshot local do usuário autenticado.
// Deve ser chamado logo após o login, antes de qualquer outra rota do serviço social.
export async function socialLogIn() {
  const { data } = await socialApi.post<UserSnapshotCreatedResponse>('/v1/auth/context/log-in')
  return data
}

// Falha com 404 se o snapshot ainda não existir (chame socialLogIn antes).
export async function getMyInformation() {
  const { data } = await socialApi.get<UserSnapshot>('/v1/auth/context/my-information')
  return data
}
