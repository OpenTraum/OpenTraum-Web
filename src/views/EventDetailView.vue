<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { getEventById } from '@/api/event'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps<{
  id: string
}>()

const route = useRoute()
const eventStore = useEventStore()

onMounted(async () => {
  const eventId = props.id || (route.params.id as string)
  eventStore.setLoading(true)
  try {
    const response = await getEventById(eventId)
    eventStore.setCurrentEvent(response.data)
  } catch (error) {
    eventStore.setError('이벤트 정보를 불러오는데 실패했습니다.')
  } finally {
    eventStore.setLoading(false)
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <LoadingSpinner v-if="eventStore.loading" />

    <div v-else-if="eventStore.error" class="text-center py-12">
      <p class="text-red-600">{{ eventStore.error }}</p>
    </div>

    <div v-else-if="eventStore.currentEvent" class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Event Image -->
      <div class="h-64 bg-gray-200 flex items-center justify-center">
        <span class="text-gray-400">이벤트 이미지</span>
      </div>

      <!-- Event Info -->
      <div class="p-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ eventStore.currentEvent.title }}
          </h1>
          <span
            class="text-sm font-semibold px-3 py-1 rounded-full"
            :class="{
              'bg-green-100 text-green-800': eventStore.currentEvent.status === 'ON_SALE',
              'bg-blue-100 text-blue-800': eventStore.currentEvent.status === 'UPCOMING',
              'bg-red-100 text-red-800': eventStore.currentEvent.status === 'SOLD_OUT',
              'bg-gray-100 text-gray-800': eventStore.currentEvent.status === 'CANCELLED',
            }"
          >
            {{ eventStore.currentEvent.status }}
          </span>
        </div>

        <div class="space-y-3 text-gray-600 mb-6">
          <p><span class="font-medium">장소:</span> {{ eventStore.currentEvent.venue }}</p>
          <p><span class="font-medium">날짜:</span> {{ eventStore.currentEvent.date }}</p>
          <p>
            <span class="font-medium">시간:</span>
            {{ eventStore.currentEvent.startTime }} - {{ eventStore.currentEvent.endTime }}
          </p>
          <p>
            <span class="font-medium">잔여 좌석:</span>
            {{ eventStore.currentEvent.availableSeats }} / {{ eventStore.currentEvent.totalSeats }}
          </p>
        </div>

        <p class="text-gray-700 mb-8">{{ eventStore.currentEvent.description }}</p>

        <div class="flex items-center justify-between">
          <p class="text-2xl font-bold text-primary-600">
            {{ eventStore.currentEvent.price.toLocaleString() }}원
          </p>
          <RouterLink
            v-if="eventStore.currentEvent.status === 'ON_SALE'"
            :to="{ name: 'reservation', params: { eventId: eventStore.currentEvent.id } }"
            class="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            예매하기
          </RouterLink>
        </div>
      </div>
    </div>

    <RouterLink
      to="/events"
      class="inline-block mt-6 text-primary-600 hover:text-primary-800 font-medium"
    >
      &larr; 목록으로 돌아가기
    </RouterLink>
  </div>
</template>
