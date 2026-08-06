import { api } from './axios'
import type { ApiMutationResponse } from '@/types/api'
import type { UploadedImage } from '@/types/upload'

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await api.post<ApiMutationResponse<UploadedImage>>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}
