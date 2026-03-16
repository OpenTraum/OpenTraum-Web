<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getEventById } from '@/api/event'
import type { Event } from '@/stores/event'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps<{
  eventId: string
}>()

const route = useRoute()
const router = useRouter()

const event = ref<Event | null>(null)
const quantity = ref(1)
const loading = ref(true)
const submitting = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  const id = props.eventId || (route.params.eventId as string)
  try {
    const response = await getEventById(id)
    event.value = response.data
  } catch (err) {
    error.value = '이벤트 정보를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
})

async function handleReservation() {
  if (!event.value) return

  submitting.value = true
  try {
    // TODO: call reservation API
    alert('예매 기능은 추후 구현 예정입니다.')
    router.push({ name: 'my-page' })
  } catch (err) {
    error.value = '예매에 실패했습니다. 다시 시도해주세요.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">티켓 예매</h1>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="event" class="bg-white rounded-lg shadow-md p-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ event.title }}</h2>

      <div class="space-y-2 text-gray-600 mb-6 pb-6 border-b">
        <p><span class="font-medium">장소:</span> {{ event.venue }}</p>
        <p><span class="font-medium">날짜:</span> {{ event.date }}</p>
        <p><span class="font-medium">가격:</span> {{ event.price.toLocaleString() }}원</p>
        <p><span class="font-medium">잔여 좌석:</span> {{ event.availableSeats }}석</p>
      </div>

      <form @submit.prevent="handleReservation">
        <div class="mb-6">
          <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
            수량 선택
          </label>
          <select
            id="quantity"
            v-model="quantity"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option v-for="i in Math.min(4, event.availableSeats)" :key="i" :value="i">
              {{ i }}매
            </option>
          </select>
        </div>

        <div class="bg-gray-50 rounded-md p-4 mb-6">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-700">총 결제 금액</span>
            <span class="text-xl font-bold text-primary-600">
              {{ (event.price * quantity).toLocaleString() }}원
            </span>
          </div>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? '예매 처리 중...' : '예매하기' }}
        </button>
      </form>
    </div>
  </div>
</template>
