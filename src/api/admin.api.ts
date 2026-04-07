import client from './client'

export const adminApi = {
  /** 좌석 풀 초기화 (관리자용) */
  async initializeSeatPools(scheduleId: string): Promise<void> {
    await client.post(`/v1/admin/seats/${scheduleId}/initialize`)
  },
}
