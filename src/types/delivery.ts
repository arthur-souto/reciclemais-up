import type { Material } from './material'

export type DeliveryStatus = 'PENDING' | 'COMPLETED' | 'CANCELED'

export interface Delivery {
  id: number | null
  local: string
  material_type: string
  status: DeliveryStatus
  quantity: number
  weight: number
  total_score: number
  evidence_url: string | null
  // Datas trafegam como string ISO 8601 (o backend serializa objetos Date via JSON).
  collected_at: string | null
  latitude: number
  longitude: number
  created_at: string | null
  updated_at: string | null
  fk_user: string | null
  fk_material: number | null
  fk_approved_by: string | null
  material: Material | null
}

export interface CreateDeliveryPayload {
  local: string
  material_type: string
  quantity: number
  weight: number
  total_score: number
  latitude: number
  longitude: number
  fk_material: number
  evidence_url?: string
  // Timestamp em ms (class-transformer aceita number ou string ISO e converte para Date).
  collected_at?: number
}

export interface UpdateDeliveryPayload {
  local?: string
  material_type?: string
  quantity?: number
  weight?: number
  total_score?: number
  latitude?: number
  longitude?: number
  fk_material?: number
  evidence_url?: string
  status?: DeliveryStatus
  // collected_at fica de fora de propósito: mesmo com a validação já consistente
  // entre create/update, o DrizzleDeliveryRepository.update() ainda não persiste
  // weight/latitude/longitude/collected_at (só o save() do create foi corrigido).
  // Confirmar com o backend antes de expor edição desses campos.
}
