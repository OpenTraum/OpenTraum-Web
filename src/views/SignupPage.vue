<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, UserIcon, Phone, Loader2, Ticket, Megaphone } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirm = ref('')
const role = ref<UserRole>('CONSUMER')
const loading = ref(false)
const error = ref('')

function formatPhone(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/\D/g, '').slice(0, 11)
  let formatted = raw
  if (raw.length > 3 && raw.length <= 7) {
    formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`
  } else if (raw.length > 7) {
    formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`
  }
  phone.value = formatted
  input.value = formatted
}

async function handleSubmit() {
  error.value = ''

  if (password.value !== passwordConfirm.value) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  if (password.value.length < 8) {
    error.value = '비밀번호는 8자 이상이어야 합니다.'
    return
  }

  loading.value = true
  try {
    await authStore.signup(email.value, password.value, name.value, phone.value, role.value)
    router.push(role.value === 'ORGANIZER' ? '/admin/events' : '/concerts')
  } catch {
    error.value = '회원가입에 실패했습니다. 다시 시도해주세요.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex">
    <!-- 좌측: 로고 브랜딩 (다크) -->
    <div class="hidden lg:flex w-1/2 items-center justify-center bg-background relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
      <div class="relative flex flex-col items-center text-center px-12">
        <img src="@/assets/logo.png" alt="OpenTraum" class="h-96 w-auto mb-10" />
        <h2 class="font-display text-4xl font-bold text-foreground mb-3">OpenTraum</h2>
        <p class="text-muted-foreground text-lg leading-relaxed max-w-sm">
          스마트 티켓팅 플랫폼.<br />AI가 설계하고, 모두가 신뢰하는 예매 경험.
        </p>
      </div>
    </div>

    <!-- 우측: 회원가입 폼 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
      <div class="w-full max-w-md">
        <!-- 모바일에서만 로고 표시 -->
        <div class="flex flex-col items-center mb-8 lg:hidden">
          <img src="@/assets/logo.png" alt="OpenTraum" class="h-56 w-auto mb-4" />
        </div>

        <div class="mb-8 lg:mb-10">
          <h1 class="font-display text-2xl font-bold text-gray-900">Create Account</h1>
          <p class="text-sm text-gray-500 mt-1">OpenTraum에 가입하세요</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div
            v-if="error"
            class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          >
            {{ error }}
          </div>

          <!-- 역할 선택 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">가입 유형</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="role = 'CONSUMER'"
                :class="[
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  role === 'CONSUMER'
                    ? 'border-primary bg-primary/5 bg-primary/10'
                    : 'border-input border-gray-200 hover:border-primary/50'
                ]"
              >
                <Ticket class="w-5 h-5" :class="role === 'CONSUMER' ? 'text-primary' : 'text-gray-400'" />
                <span class="text-sm font-medium" :class="role === 'CONSUMER' ? 'text-primary' : 'text-gray-700'">티켓 구매자</span>
                <span class="text-xs text-gray-400">공연 예매</span>
              </button>
              <button
                type="button"
                @click="role = 'ORGANIZER'"
                :class="[
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  role === 'ORGANIZER'
                    ? 'border-primary bg-primary/5 bg-primary/10'
                    : 'border-input border-gray-200 hover:border-primary/50'
                ]"
              >
                <Megaphone class="w-5 h-5" :class="role === 'ORGANIZER' ? 'text-primary' : 'text-gray-400'" />
                <span class="text-sm font-medium" :class="role === 'ORGANIZER' ? 'text-primary' : 'text-gray-700'">이벤트 주최자</span>
                <span class="text-xs text-gray-400">공연 등록 / 관리</span>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-gray-700">이름</label>
            <div class="relative">
              <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="name"
                v-model="name"
                type="text"
                required
                placeholder="홍길동"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-gray-700">이메일</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="name@example.com"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium text-gray-700">전화번호</label>
            <div class="relative">
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="phone"
                :value="phone"
                type="tel"
                required
                maxlength="13"
                placeholder="010-0000-0000"
                @input="formatPhone"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-gray-700">비밀번호</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="8자 이상"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="password-confirm" class="text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password-confirm"
                v-model="passwordConfirm"
                type="password"
                required
                placeholder="비밀번호를 다시 입력해주세요"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-11 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? '가입 중...' : '회원가입' }}
          </button>

          <p class="text-center text-sm text-gray-500">
            이미 계정이 있으신가요?
            <RouterLink to="/login" class="text-primary font-medium hover:underline">
              로그인
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
