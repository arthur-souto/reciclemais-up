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

// Erro default do serviço social (Spring Boot), diferente do ApiErrorResponse da bff-web.
export interface SocialApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

// Paginação padrão do Spring Data (PagedModel), usada pelo serviço social.
export interface SpringPage<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}
