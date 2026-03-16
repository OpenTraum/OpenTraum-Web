import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface Event {
  id: string
  title: string
  description: string
  venue: string
  date: string
  startTime: string
  endTime: string
  totalSeats: number
  availableSeats: number
  price: number
  imageUrl?: string
  status: 'UPCOMING' | 'ON_SALE' | 'SOLD_OUT' | 'CANCELLED'
}

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([])
  const currentEvent = ref<Event | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setEvents(data: Event[]) {
    events.value = data
  }

  function setCurrentEvent(data: Event | null) {
    currentEvent.value = data
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setError(message: string | null) {
    error.value = message
  }

  return {
    events,
    currentEvent,
    loading,
    error,
    setEvents,
    setCurrentEvent,
    setLoading,
    setError,
  }
})
