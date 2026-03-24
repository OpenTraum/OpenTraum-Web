import type { Concert } from '@/types/concert'
import client from './client'

export const concertApi = {
  async getAll(): Promise<Concert[]> {
    const { data } = await client.get<Concert[]>('/v1/concerts')
    return data.map((c) => ({ ...c, id: String(c.id), image: c.image || '' }))
  },

  async getById(id: string): Promise<Concert | undefined> {
    const { data } = await client.get<Concert>(`/v1/concerts/${id}`)
    if (!data) return undefined
    return { ...data, id: String(data.id), image: data.image || '' }
  },
}
