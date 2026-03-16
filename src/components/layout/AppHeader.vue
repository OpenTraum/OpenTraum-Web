<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function handleLogout() {
  authStore.logout()
}
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <RouterLink to="/" class="text-xl font-bold text-primary-600">
          OpenTraum
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <RouterLink
            to="/events"
            class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            이벤트
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/my-page"
              class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              마이페이지
            </RouterLink>
            <button
              class="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              @click="handleLogout"
            >
              로그아웃
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
            >
              로그인
            </RouterLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden text-gray-600 hover:text-gray-900"
          @click="toggleMobileMenu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-2">
        <RouterLink
          to="/events"
          class="block py-2 text-gray-600 hover:text-primary-600 font-medium"
          @click="mobileMenuOpen = false"
        >
          이벤트
        </RouterLink>

        <template v-if="authStore.isAuthenticated">
          <RouterLink
            to="/my-page"
            class="block py-2 text-gray-600 hover:text-primary-600 font-medium"
            @click="mobileMenuOpen = false"
          >
            마이페이지
          </RouterLink>
          <button
            class="block py-2 text-gray-600 hover:text-primary-600 font-medium"
            @click="handleLogout"
          >
            로그아웃
          </button>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="block py-2 text-primary-600 font-medium"
            @click="mobileMenuOpen = false"
          >
            로그인
          </RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>
