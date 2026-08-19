export type SnapshotOperation = 'CREATED' | 'READ' | 'EXCLUDED'

// Cópia local (snapshot) do usuário mantida pelo serviço social — não é a
// mesma entidade que `User` (bff-web), embora compartilhe boa parte dos campos.
export interface UserSnapshot {
  id: string
  name: string
  profile_image: string | null
  role: string
  total_score: number
  created_at: string
  last_synced_at: string
}

export interface UserSnapshotCreatedResponse {
  code: string
  HttpStatusCode: string
  message: string
  idUserCreatedSnapshot: string
  typeOperationSnapshot: SnapshotOperation
  created_at: string
}

export interface WhoAmIResponse {
  sub: string
  authorities: string[]
}
