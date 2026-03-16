<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getProfile } from '@/api/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const authStore = useAuthStore()
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    error.value = '로그인이 필요합니다.'
    loading.value = false
    return
  }

  try {
    const response = await getProfile()
    authStore.setUser(response.data as unknown as Record<string, unknown>)
  } catch (err) {
    error.value = '프로필 정보를 불러오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Profile Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">내 정보</h2>
        <div class="space-y-3 text-gray-600">
          <p><span class="font-medium">이름:</span> {{ (authStore.user as any)?.name ?? '-' }}</p>
          <p><span class="font-medium">이메일:</span> {{ (authStore.user as any)?.email ?? '-' }}</p>
          <p><span class="font-medium">연락처:</span> {{ (authStore.user as any)?.phone ?? '-' }}</p>
        </div>
      </div>

      <!-- Reservation History Placeholder -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">예매 내역</h2>
        <div class="text-center py-8">
          <p class="text-gray-500">예매 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>
