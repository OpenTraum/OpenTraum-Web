import apiClient from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  user: {
    id: string
    email: string
    name: string
  }
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  createdAt: string
}

export function login(data: LoginRequest) {
  return apiClient.post<AuthResponse>('/api/auth/login', data)
}

export function register(data: RegisterRequest) {
  return apiClient.post<AuthResponse>('/api/auth/register', data)
}

export function logout() {
  return apiClient.post('/api/auth/logout')
}

export function getProfile() {
  return apiClient.get<UserProfile>('/api/users/me')
}
