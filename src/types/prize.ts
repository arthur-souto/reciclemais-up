export type PrizeStatus = 'ACTIVE' | 'INACTIVE'
export type PrizeType = 'PHYSICAL' | 'DIGITAL' | 'DISCOUNT'

export interface Prize {
  id: number | null
  name: string
  required_points: number
  quantity: number | null
  image_url: string | null
  description: string
  status: PrizeStatus
  type: PrizeType
  category: string | null
  expiration_date: string | null
  created_at: string
  updated_at: string
  fk_created_by: string | null
}

export interface CreatePrizePayload {
  name: string
  required_points: number
  quantity?: number
  description: string
  category: string | null
  type: PrizeType
  image_url?: string
  expiration_date?: string
}

export interface UpdatePrizePayload {
  name?: string
  required_points?: number
  quantity?: number
  description?: string
  category?: string
  type?: PrizeType
  image_url?: string
  expiration_date?: string
  status?: PrizeStatus
}
