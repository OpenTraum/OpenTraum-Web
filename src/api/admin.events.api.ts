import client from './client'

export interface GradeConfig {
  grade: string
  price: number
  seatCount: number
}

export interface ZoneConfig {
  zone: string
  grade: string
  seatCount: number
}

export interface AiGenerateResponse {
  title: string
  artist: string | null
  venue: string
  dateTime: string
  totalSeats: number
  trackPolicy: string
  category: string
  grades: GradeConfig[]
  zones: ZoneConfig[]
}

export interface AdminEventCreateRequest {
  title: string
  artist: string | null
  venue: string
  dateTime: string
  totalSeats: number
  ticketOpenAt: string
  ticketCloseAt: string
  trackPolicy: string
  imageUrl: string | null
  organizerName: string | null
  category: string | null
  grades: GradeConfig[]
  zones: ZoneConfig[]
}

export interface AdminEventResponse {
  concertId: number
  scheduleId: number
  title: string
  artist: string | null
  venue: string
  tenantId: string
  dateTime: string
  totalSeats: number
  ticketOpenAt: string
  ticketCloseAt: string
  trackPolicy: string
  imageUrl: string | null
  status: string
  grades?: { grade: string; price: number }[]
  zones?: ZoneConfig[]
}

export interface VenuePreset {
  id: number
  name: string
  totalSeats: number
  zoneConfig: Record<string, number>
}

export interface GradeStat {
  grade: string
  totalSeats: number
  soldSeats: number
  availableSeats: number
}

export interface RecommendedAction {
  type: 'PRICE_ADJUST' | 'TRACK_CHANGE' | 'CAPACITY_WARNING' | 'MARKETING'
  title: string
  description: string
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface AdminInsightResponse {
  scheduleId: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  insights: string[]
  actions: RecommendedAction[]
}

export interface AdminDashboardResponse {
  scheduleId: number
  title: string
  status: string
  totalSeats: number
  soldSeats: number
  availableSeats: number
  gradeStats: GradeStat[]
}

export const adminEventsApi = {
  async aiGenerate(prompt: string): Promise<AiGenerateResponse> {
    const { data } = await client.post('/v1/admin/events/ai-generate', { prompt })
    return data
  },

  async create(request: AdminEventCreateRequest): Promise<AdminEventResponse> {
    const { data } = await client.post('/v1/admin/events', request)
    return data
  },

  async list(): Promise<AdminEventResponse[]> {
    const { data } = await client.get('/v1/admin/events')
    return data
  },

  async get(scheduleId: number): Promise<AdminEventResponse> {
    const { data } = await client.get(`/v1/admin/events/${scheduleId}`)
    return data
  },

  async update(scheduleId: number, request: AdminEventCreateRequest): Promise<AdminEventResponse> {
    const { data } = await client.put(`/v1/admin/events/${scheduleId}`, request)
    return data
  },

  async delete(scheduleId: number): Promise<void> {
    await client.delete(`/v1/admin/events/${scheduleId}`)
  },

  async dashboard(scheduleId: number): Promise<AdminDashboardResponse> {
    const { data } = await client.get(`/v1/admin/events/${scheduleId}/dashboard`)
    return data
  },

  async getInsights(scheduleId: number): Promise<AdminInsightResponse> {
    const { data } = await client.get(`/v1/admin/events/${scheduleId}/insights`)
    return data
  },

  async getVenues(): Promise<VenuePreset[]> {
    const { data } = await client.get('/v1/admin/venues')
    return data.map((v: VenuePreset & { zoneConfig: string | Record<string, number> }) => ({
      ...v,
      zoneConfig: typeof v.zoneConfig === 'string' ? JSON.parse(v.zoneConfig) : v.zoneConfig,
    }))
  },
}
