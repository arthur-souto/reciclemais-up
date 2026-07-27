import { api } from './axios'
import type { EvidenceResponse } from '@/types/evidence'

// A análise por IA pode levar bem mais que o timeout padrão da API.
const EVIDENCE_ANALYSIS_TIMEOUT_MS = 60_000

export async function registerEvidence(deliveryId: number, file: File) {
  const formData = new FormData()
  formData.append('evidence', file)

  const { data } = await api.post<EvidenceResponse>(`/evidence/${deliveryId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: EVIDENCE_ANALYSIS_TIMEOUT_MS,
  })
  return data.description
}
