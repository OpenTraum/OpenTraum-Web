export type SaleStatus = 'on-sale' | 'coming-soon' | 'sold-out'

export interface TicketGrade {
  id: string
  label: string // VIP, S, A
  price: number
  originalPrice?: number
  totalSeats: number
  availableSeats: number
}

export type ActiveTrack = 'lottery' | 'live' | 'none'

export type TrackPolicy = 'LOTTERY_ONLY' | 'LIVE_ONLY' | 'DUAL_TRACK'

export interface ConcertDate {
  id: string
  date: string // yyyy-MM-dd
  time: string // HH:mm
  venue: string
  city?: string
  available: boolean
  activeTrack?: ActiveTrack // 현재 열린 트랙 (없으면 둘 다 열림)
  trackPolicy?: TrackPolicy // 배정 방식 (없으면 DUAL_TRACK)
}

export interface Concert {
  id: string
  title: string
  artist: string
  venue: string
  image: string // FE 정적 매핑
  category?: string
  subtitle?: string
  description?: string
  tags?: string[]
  saleStatus: SaleStatus
  saleDate?: string
  dates: ConcertDate[]
  grades: TicketGrade[]
}
