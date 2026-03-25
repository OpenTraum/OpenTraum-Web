<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Mail, Lock, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || (authStore.isOrganizer ? '/admin/events' : '/concerts')
    router.push(redirect)
  } catch {
    error.value = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex">
    <!-- 좌측: 브랜딩 -->
    <div class="hidden lg:flex w-1/2 items-center justify-center bg-secondary relative overflow-hidden">
      <div class="mesh">
        <div class="mesh-orb mesh-1" />
        <div class="mesh-orb mesh-2" />
      </div>
      <div class="relative flex flex-col items-center text-center px-12 z-10">
        <img src="@/assets/logo.png" alt="OpenTraum" class="h-96 w-auto mb-10" />
        <h2 class="font-display text-4xl font-bold text-foreground mb-3">OpenTraum</h2>
        <p class="text-muted-foreground text-lg leading-relaxed max-w-sm">
          스마트 티켓팅 플랫폼.<br />AI가 설계하고, 모두가 신뢰하는 예매 경험.
        </p>
      </div>
    </div>

    <!-- 우측: 로그인 폼 -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-card">
      <div class="w-full max-w-md">
        <div class="flex flex-col items-center mb-8 lg:hidden">
          <img src="@/assets/logo.png" alt="OpenTraum" class="h-56 w-auto mb-4" />
        </div>

        <div class="mb-8 lg:mb-10">
          <h1 class="font-display text-2xl font-bold text-foreground">Welcome Back</h1>
          <p class="text-sm text-muted-foreground mt-1">계정에 로그인하세요</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div
            v-if="error"
            class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
          >
            {{ error }}
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-foreground">이메일</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="name@example.com"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-foreground">비밀번호</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? '로그인 중...' : '로그인' }}
          </button>

          <p class="text-center text-sm text-muted-foreground">
            계정이 없으신가요?
            <RouterLink to="/signup" class="text-primary font-medium hover:underline">
              회원가입
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mesh {
  position: absolute;
  inset: 0;
  filter: blur(100px);
  opacity: 0.6;
}
.mesh-orb { position: absolute; border-radius: 50%; }
.mesh-1 {
  top: -20%; left: -10%; width: 400px; height: 400px;
  background: radial-gradient(circle, hsl(220 85% 70% / 0.3), transparent 70%);
  animation: drift-a 18s ease-in-out infinite alternate;
}
.mesh-2 {
  bottom: -15%; right: -10%; width: 350px; height: 350px;
  background: radial-gradient(circle, hsl(200 80% 72% / 0.2), transparent 70%);
  animation: drift-b 22s ease-in-out infinite alternate;
}
@keyframes drift-a {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, -30px) scale(1.1); }
}
@keyframes drift-b {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-30px, 20px) scale(1.05); }
}
</style>
