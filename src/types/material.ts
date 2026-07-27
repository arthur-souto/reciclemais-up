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

// Pontuação base sugerida por importância; o usuário pode ajustar livremente no formulário.
export const BASE_POINTS_BY_IMPORTANCE: Record<ImportanceValue, number> = {
  [Importance.EXTREMELY_LOW.value]: 5,
  [Importance.VERY_LOW.value]: 10,
  [Importance.LOW.value]: 25,
  [Importance.MEDIUM.value]: 50,
  [Importance.LOW_IMPORTANCE.value]: 80,
  [Importance.IMPORTANT.value]: 120,
  [Importance.VERY_IMPORTANT.value]: 300,
};


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
