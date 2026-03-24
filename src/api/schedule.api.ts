import client from './client'

export interface GradeResponse {
  grade: string // "VIP", "S", "A"
  price: number
}

export const scheduleApi = {
  /** 회차별 등급 목록 */
  async getGrades(scheduleId: string): Promise<GradeResponse[]> {
    return (await client.get<GradeResponse[]>(`/v1/schedules/${scheduleId}/grades`)).data
  },

  /** 등급별 구역 목록 */
  async getZonesByGrade(scheduleId: string, grade: string): Promise<string[]> {
    return (await client.get<string[]>(`/v1/schedules/${scheduleId}/grades/${grade}/zones`)).data
  },
}
