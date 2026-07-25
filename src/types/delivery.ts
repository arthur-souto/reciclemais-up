export type DeliveryStatus = 'PENDING' | 'COMPLETED' | 'CANCELED'

export interface Delivery {
  id: number | null
  local: string
  material_type: string
  status: DeliveryStatus
  quantity: number
  evidence_url: string | null
  fk_user: string | null
  fk_material: number | null
}

export interface CreateDeliveryPayload {
  local: string
  material_type: string
  quantity: number
  fk_material: number
  evidence_url?: string
}

export interface UpdateDeliveryPayload {
  local?: string
  material_type?: string
  quantity?: number
  fk_material?: number
  evidence_url?: string
  status?: DeliveryStatus
}
