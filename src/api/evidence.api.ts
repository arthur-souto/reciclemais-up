import { api } from './axios'
import type { EvidenceResponse } from '@/types/evidence'

export async function registerEvidence(file: File) {
  const formData = new FormData()
  formData.append('evidence', file)

  const { data } = await api.post<EvidenceResponse>('/evidence', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
