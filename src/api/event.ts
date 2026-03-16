import apiClient from './client'
import type { Event } from '@/stores/event'

export interface EventListParams {
  page?: number
  size?: number
  status?: string
  keyword?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export function getEvents(params?: EventListParams) {
  return apiClient.get<PageResponse<Event>>('/api/events', { params })
}

export function getEventById(id: string) {
  return apiClient.get<Event>(`/api/events/${id}`)
}
