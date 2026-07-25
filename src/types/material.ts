export interface Material {
  id: number | null
  name: string
  importance: number
  points_value: number
  fk_user: string | null
}

export interface CreateMaterialPayload {
  name: string
  importance: number
  points_value: number
}

export interface UpdateMaterialPayload {
  name?: string
  importance?: number
  points_value?: number
}
