export const Importance = {
  EXTREMELY_LOW: { label: "Extremamente baixa", value: 1 },
  VERY_LOW: { label: "Muito baixa", value: 2 },
  LOW: { label: "Baixa", value: 5 },
  MEDIUM: { label: "Média", value: 10 },
  LOW_IMPORTANCE: { label: "Pouco importante", value: 15 },
  IMPORTANT: { label: "Importante", value: 20 },
  VERY_IMPORTANT: { label: "Muito importante", value: 60 },
} as const;

export type ImportanceValue =
  (typeof Importance)[keyof typeof Importance]["value"];


export interface Material {
  id: number | null
  name: string
  importance: ImportanceValue
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
