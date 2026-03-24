import type { AuthResponse, AuthApiResponse, LoginRequest, SignupRequest, UserRole } from '@/types/auth'
import client from './client'

function mapAuthResponse(raw: AuthApiResponse, name?: string, phone?: string): AuthResponse {
  return {
    accessToken: raw.token,
    user: {
      id: String(raw.userId),
      email: raw.email,
      name: name ?? raw.name ?? '',
      phone: phone ?? '',
      role: (raw.role as UserRole) ?? 'CONSUMER',
      tenantId: raw.tenantId,
    },
  }
}

export const authApi = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const raw = (await client.post<AuthApiResponse>('/v1/auth/signup', data)).data
    return mapAuthResponse(raw, data.name, data.phone)
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const raw = (await client.post<AuthApiResponse>('/v1/auth/login', data)).data
    return mapAuthResponse(raw)
  },

  async logout(): Promise<void> {
    await client.post('/v1/auth/logout')
  },
}
