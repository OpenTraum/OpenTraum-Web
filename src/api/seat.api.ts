import type { Seat, SeatSection, VenueSectionInfo } from '@/types/seat'
import client from './client'

export interface SeatSelectionResponse {
  scheduleId: number
  grade: string
  zone: string
  seatNumber: string
  holdExpiresAt: string
  paymentDeadline: string
  message: string
}

/* --- venue layout JSON types --- */
interface VenueSectionConfig {
  id: string
  floor: string
  grade: string
  rows: number
  seatsPerRow: number
}

interface VenueLayout {
  venue: string
  sections: VenueSectionConfig[]
}

/* --- layout cache (fetch once per venue) --- */
const layoutCache: Record<string, VenueLayout> = {}

async function fetchVenueLayout(venueName: string): Promise<VenueLayout> {
  if (layoutCache[venueName]) return layoutCache[venueName]
  const res = await fetch(`/venues/${encodeURIComponent(venueName)}.json`)
  if (!res.ok) throw new Error(`공연장 레이아웃을 찾을 수 없습니다: ${venueName}`)
  const layout: VenueLayout = await res.json()
  layoutCache[venueName] = layout
  return layout
}

/* --- coordinate builder --- */
function buildSectionSeats(config: VenueSectionConfig): SeatSection {
  const seats: Seat[] = []
  const rowLabels = Array.from({ length: config.rows }, (_, i) =>
    String.fromCharCode(65 + i),
  )
  const startX = Math.max(20, Math.floor((700 - config.seatsPerRow * 28) / 2))
  const startY = 80

  for (let ri = 0; ri < config.rows; ri++) {
    const rowLabel = rowLabels[ri] ?? String(ri)
    for (let si = 1; si <= config.seatsPerRow; si++) {
      seats.push({
        id: `${config.id}-${rowLabel}${si}`,
        section: config.id,
        row: rowLabel,
        number: si,
        gradeId: config.grade,
        status: 'available',
        x: startX + (si - 1) * 28,
        y: startY + ri * 28,
      })
    }
  }

  return { id: config.id, label: `${config.id}구역`, seats }
}

export const seatApi = {
  /** 구역 목록 + 등급/잔여석 (VenueMap용) */
  async getVenueSections(venueName: string, _dateId: string): Promise<VenueSectionInfo[]> {
    const layout = await fetchVenueLayout(venueName)
    return layout.sections.map((config) => {
      const section = buildSectionSeats(config)
      return {
        id: config.id,
        label: config.id,
        grade: config.grade,
        totalSeats: section.seats.length,
        availableSeats: section.seats.length,
      }
    })
  },

  /** 특정 구역의 좌석 목록 (SeatMap용) */
  async getSectionSeats(
    venueName: string,
    _dateId: string,
    sectionId: string,
  ): Promise<SeatSection[]> {
    const layout = await fetchVenueLayout(venueName)
    const config = layout.sections.find((s) => s.id === sectionId)
    if (!config) return []
    return [buildSectionSeats(config)]
  },

  /** 전체 좌석맵 */
  async getSeatMap(venueName: string, _dateId: string): Promise<SeatSection[]> {
    const layout = await fetchVenueLayout(venueName)
    return layout.sections.map((config) => buildSectionSeats(config))
  },

  /** 특정 등급+구역의 예매 가능 좌석번호 목록 */
  async getAvailableSeats(scheduleId: string, grade: string, zone: string): Promise<string[]> {
    return (
      await client.get<string[]>(`/v1/live/${scheduleId}`, { params: { grade, zone } })
    ).data
  },

  /** 좌석 선택 (홀드) */
  async selectSeat(
    scheduleId: string,
    grade: string,
    zone: string,
    seatNumber: string,
  ): Promise<SeatSelectionResponse> {
    return (
      await client.post<SeatSelectionResponse>(`/v1/live/${scheduleId}`, {
        scheduleId: Number(scheduleId),
        grade,
        zone,
        seatNumber,
      })
    ).data
  },

  /** 좌석 선택 해제 */
  async releaseSeat(scheduleId: string, zone: string, seatNumber: string): Promise<void> {
    await client.delete(`/v1/live/${scheduleId}`, { params: { zone, seatNumber } })
  },

  /** 라이브 트랙 오픈 여부 */
  async isLiveOpen(scheduleId: string): Promise<boolean> {
    return (await client.get<boolean>(`/v1/live/${scheduleId}/status`)).data
  },
}
