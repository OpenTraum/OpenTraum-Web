import type { Reservation, TrackType } from '@/types/reservation'
import client from './client'

export interface LotteryResultResponse {
  id: number
  scheduleId: number
  grade: string
  quantity: number
  status: string
  resultType: 'PAYMENT_PENDING' | 'WON' | 'ASSIGNED' | 'LOST'
  message: string
  paymentDeadline: string
  seats: { zone: string; seatNumber: string }[]
}

export interface CancellationWindowResponse {
  allowed: boolean
  windowStart: string
  windowEnd: string
  message: string
}

export const reservationApi = {
  /** 로터리 트랙 예약 */
  async createLottery(params: {
    scheduleId: string
    grade: string
    quantity: number
    token: string
    concertTitle: string
    gradeId: string
    gradeLabel: string
    unitPrice: number
  }): Promise<Reservation> {
    const { data } = await client.post(
      `/v1/lottery/${params.scheduleId}`,
      { scheduleId: params.scheduleId, grade: params.grade, quantity: params.quantity },
      { headers: { 'X-Queue-Token': params.token } },
    )
    return {
      id: String(data.id),
      concertId: params.scheduleId,
      concertTitle: params.concertTitle,
      dateId: params.scheduleId,
      track: 'lottery',
      gradeId: params.gradeId,
      gradeLabel: params.gradeLabel,
      quantity: params.quantity,
      unitPrice: params.unitPrice,
      totalPrice: params.unitPrice * params.quantity,
      status: data.status?.toLowerCase() ?? 'pending',
      createdAt: data.createdAt ?? new Date().toISOString(),
      expiresAt: data.paymentDeadline ?? new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    }
  },

  /** 로터리 예약 결과 조회 */
  async getById(id: string): Promise<Reservation | undefined> {
    const { data } = await client.get(`/v1/lottery/reservations/${id}`)
    if (!data) return undefined
    return {
      id: String(data.id),
      concertId: String(data.scheduleId),
      concertTitle: '',
      dateId: String(data.scheduleId),
      track: 'lottery',
      gradeId: data.grade?.toLowerCase() ?? '',
      gradeLabel: data.grade ?? '',
      quantity: data.quantity ?? 1,
      unitPrice: 0,
      totalPrice: 0,
      status: data.status?.toLowerCase() ?? 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: data.paymentDeadline ?? new Date().toISOString(),
    }
  },

  /** 내 예약 목록 (결제 + 예약 조합) */
  async getMyTickets(): Promise<Reservation[]> {
    const [{ data: payments }, { data: reservations }] = await Promise.all([
      client.get('/v1/payment/my'),
      client.get('/v1/reservations/my'),
    ])
    // reservationId -> trackType mapping
    const trackMap = new Map<string, string>()
    const gradeMap = new Map<string, string>()
    const qtyMap = new Map<string, number>()
    if (Array.isArray(reservations)) {
      for (const r of reservations) {
        trackMap.set(String(r.id), (r.trackType ?? 'LOTTERY').toLowerCase())
        gradeMap.set(String(r.id), r.grade ?? '')
        qtyMap.set(String(r.id), r.quantity ?? 1)
      }
    }
    if (!Array.isArray(payments)) return []
    return payments.map((p: any) => {
      const resId = String(p.reservationId)
      return {
        id: resId,
        concertId: '',
        concertTitle: '',
        dateId: '',
        track: (trackMap.get(resId) ?? 'lottery') as TrackType,
        gradeId: '',
        gradeLabel: gradeMap.get(resId) ?? '',
        quantity: qtyMap.get(resId) ?? 1,
        unitPrice: p.amount ?? 0,
        totalPrice: p.amount ?? 0,
        status: (p.status === 'COMPLETED' ? 'paid' : 'pending') as Reservation['status'],
        createdAt: p.createdAt ?? new Date().toISOString(),
        expiresAt: p.expiresAt ?? new Date().toISOString(),
      }
    })
  },

  /** 내 로터리 예약 결과 목록 (스케줄별) */
  async getLotteryResults(scheduleId: string): Promise<LotteryResultResponse[]> {
    return (
      await client.get<LotteryResultResponse[]>('/v1/lottery/reservations', {
        params: { scheduleId },
      })
    ).data
  },

  /** 취소 가능 기간 조회 */
  async getCancellationWindow(scheduleId: string): Promise<CancellationWindowResponse> {
    return (
      await client.get<CancellationWindowResponse>(
        `/v1/reservations/schedules/${scheduleId}/cancellation-window`,
      )
    ).data
  },

  /** 예약 취소 */
  async cancel(reservationId: string): Promise<void> {
    await client.delete(`/v1/reservations/${reservationId}`)
  },
}
