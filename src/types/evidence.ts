export interface EvidenceAnalysis {
  valid: boolean
  reason: string
  quality: number
  finalScore: number
}

export interface EvidenceResponse {
  description: EvidenceAnalysis
}
