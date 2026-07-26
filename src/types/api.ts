export interface ApiErrorResponse {
  code: number
  error: string
  dataHora: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiListResponse<T> {
  payload: T[]
  meta: PaginationMeta
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
