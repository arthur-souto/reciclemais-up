export interface ApiErrorResponse {
  code: number
  error: string
  dataHora: string
}

export interface ApiListResponse<T> {
  payload: T[]
}

export interface ApiItemResponse<T> {
  payload: T
}

export interface ApiMutationResponse<T> {
  description: string
  data: T
}

export interface ApiMessageResponse {
  description: string
}
