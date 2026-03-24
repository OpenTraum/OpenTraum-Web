import type {
  QueueEntry,
  QueuePollResponse,
  QueueEntryApiResponse,
  QueueStatusApiResponse,
} from '@/types/queue'
import client from './client'

export const queueApi = {
  async join(scheduleId: string): Promise<QueueEntry> {
    const raw = (await client.post<QueueEntryApiResponse>(`/v1/queue/${scheduleId}/enter`)).data
    return {
      queueId: String(raw.scheduleId),
      concertId: String(raw.scheduleId),
      position: raw.position,
      totalAhead: raw.position,
      estimatedWaitSeconds: raw.estimatedWaitMinutes * 60,
      status: 'waiting',
    }
  },

  async poll(scheduleId: string): Promise<QueuePollResponse> {
    const raw = (await client.get<QueueStatusApiResponse>(`/v1/queue/${scheduleId}/status`)).data
    return {
      position: raw.position,
      totalAhead: raw.aheadCount,
      estimatedWaitSeconds: raw.estimatedWaitMinutes * 60,
      status: raw.status === 'READY' ? 'ready' : 'waiting',
      token: raw.token ?? undefined,
    }
  },

  async heartbeat(scheduleId: string): Promise<void> {
    await client.post(`/v1/queue/${scheduleId}/heartbeat`)
  },

  async cancel(scheduleId: string): Promise<void> {
    await client.delete(`/v1/queue/${scheduleId}/leave`)
  },
}
