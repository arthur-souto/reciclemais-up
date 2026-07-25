export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  description: string
  accessToken: string
}
