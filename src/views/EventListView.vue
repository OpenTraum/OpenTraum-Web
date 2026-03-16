<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { getEvents } from '@/api/event'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const eventStore = useEventStore()

onMounted(async () => {
  eventStore.setLoading(true)
  try {
    const response = await getEvents()
    eventStore.setEvents(response.data.content)
  } catch (error) {
    eventStore.setError('이벤트 목록을 불러오는데 실패했습니다.')
  } finally {
    eventStore.setLoading(false)
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">이벤트 목록</h1>

    <LoadingSpinner v-if="eventStore.loading" />

    <div v-else-if="eventStore.error" class="text-center py-12">
      <p class="text-red-600">{{ eventStore.error }}</p>
    </div>

    <div v-else-if="eventStore.events.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">등록된 이벤트가 없습니다.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="event in eventStore.events"
        :key="event.id"
        :to="{ name: 'event-detail', params: { id: event.id } }"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <span class="text-gray-400 text-sm">이벤트 이미지</span>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <span
              class="text-xs font-semibold px-2 py-1 rounded-full"
              :class="{
                'bg-green-100 text-green-800': event.status === 'ON_SALE',
                'bg-blue-100 text-blue-800': event.status === 'UPCOMING',
                'bg-red-100 text-red-800': event.status === 'SOLD_OUT',
                'bg-gray-100 text-gray-800': event.status === 'CANCELLED',
              }"
            >
              {{ event.status }}
            </span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ event.title }}</h3>
          <p class="text-sm text-gray-500 mb-2">{{ event.venue }}</p>
          <p class="text-sm text-gray-500">{{ event.date }}</p>
          <p class="mt-3 text-lg font-bold text-primary-600">
            {{ event.price.toLocaleString() }}원
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
