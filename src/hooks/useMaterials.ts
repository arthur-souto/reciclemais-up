import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMaterial, deleteMaterial, getMaterialById, getMaterials, updateMaterial } from '@/api/material.api'
import type { CreateMaterialPayload, UpdateMaterialPayload } from '@/types/material'

export const materialKeys = {
  all: ['materials'] as const,
  detail: (id: number) => [...materialKeys.all, id] as const,
}

export function useMaterials() {
  return useQuery({
    queryKey: materialKeys.all,
    queryFn: getMaterials,
  })
}

export function useMaterial(id: number) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => getMaterialById(id),
    enabled: !!id,
  })
}

export function useCreateMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMaterialPayload) => createMaterial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
    },
  })
}

export function useUpdateMaterial(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateMaterialPayload) => updateMaterial(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(id) })
    },
  })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
    },
  })
}
