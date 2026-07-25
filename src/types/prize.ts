export interface Prize {
  id: number | null
  name: string
  required_points: number
  description: string
  fk_user: string | null
}

export interface CreatePrizePayload {
  name: string
  required_points: number
  description: string
}

export interface UpdatePrizePayload {
  name?: string
  required_points?: number
  description?: string
}
