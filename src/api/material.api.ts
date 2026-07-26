import { api } from './axios'
import type {
  ApiItemResponse,
  ApiListResponse,
  ApiMessageResponse,
  ApiMutationResponse,
  PaginationParams,
} from '@/types/api'
import type { CreateMaterialPayload, Material, UpdateMaterialPayload } from '@/types/material'

export async function createMaterial(payload: CreateMaterialPayload) {
  const { data } = await api.post<ApiMutationResponse<Material>>('/materials', payload)
  return data.data
}

export async function getMaterials(params?: PaginationParams) {
  const { data } = await api.get<ApiListResponse<Material>>('/materials', { params })
  return data
}

export async function searchMaterialsByTarget(target: string, page = 1, limit = 10) {
  const trimmedTarget = target.trim()
  const { data } = await api.get<ApiListResponse<Material>>('/materials/search', {
    params: {
      page,
      limit,
      // Omitir "target" quando vazio faz o backend tratar como listagem completa;
      // enviar "target=" vazio faz o backend retornar zero resultados.
      ...(trimmedTarget ? { target: trimmedTarget } : {}),
    },
  })
  return data
}

export async function getMaterialById(id: number) {
  const { data } = await api.get<ApiItemResponse<Material>>(`/materials/${id}`)
  return data.payload
}

export async function updateMaterial(id: number, payload: UpdateMaterialPayload) {
  const { data } = await api.patch<ApiMutationResponse<Material>>(`/materials/${id}`, payload)
  return data.data
}

export async function deleteMaterial(id: number) {
  const { data } = await api.delete<ApiMessageResponse>(`/materials/${id}`)
  return data
}
