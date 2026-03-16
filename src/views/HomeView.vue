<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <section class="text-center py-20">
      <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
        <span class="block">OpenTraum</span>
        <span class="block text-primary-600 mt-2">공연 티켓 예매 플랫폼</span>
      </h1>
      <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
        다양한 공연과 이벤트를 손쉽게 탐색하고, 빠르고 안전하게 티켓을 예매하세요.
      </p>
      <div class="mt-10 flex justify-center gap-4">
        <RouterLink
          to="/events"
          class="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          이벤트 둘러보기
        </RouterLink>
        <RouterLink
          to="/login"
          class="px-8 py-3 border border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
        >
          로그인
        </RouterLink>
      </div>
    </section>

    <!-- Featured Events Placeholder -->
    <section class="py-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">인기 이벤트</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div class="h-48 bg-gray-200 rounded-md mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </section>
  </div>
</template>
