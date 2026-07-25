import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getUserByEmail, getUserById, updateUser } from '@/api/user.api'
import type { CreateUserPayload, UpdateUserPayload } from '@/types/user'

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
  byEmail: (email: string) => [...userKeys.all, 'email', email] as const,
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
}

export function useUserByEmail(email: string) {
  return useQuery({
    queryKey: userKeys.byEmail(email),
    queryFn: () => getUserByEmail(email),
    enabled: !!email,
  })
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}
