export type UserRole = 'CONSUMER' | 'ORGANIZER'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  tenantId?: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
  phone: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

// BE 실제 응답 형식
export interface AuthApiResponse {
  userId: number
  email: string
  name: string
  role: string
  tenantId?: string
  token: string
}
