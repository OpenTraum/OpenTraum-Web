<script setup lang="ts">
import { ref, computed } from 'vue'
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

// ── Eye tracking ──
const mx = ref(0.5)
const my = ref(0.5)
function onMouse(e: MouseEvent) {
  mx.value = e.clientX / window.innerWidth
  my.value = e.clientY / window.innerHeight
}
const px = computed(() => Math.max(-4, Math.min(4, (mx.value - 0.25) * 14)))
const py = computed(() => Math.max(-3, Math.min(3, (my.value - 0.5) * 12)))

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
  <div class="auth-page" @mousemove="onMouse">
    <!-- ═══ LEFT: CHARACTER PLAYGROUND ═══ -->
    <div class="hidden lg:flex playground">
      <div class="bubble b1" />
      <div class="bubble b2" />
      <div class="bubble b3" />
      <div class="bubble b4" />
      <div class="bubble b5" />

      <!-- Cloud character -->
      <svg class="cloud-char" viewBox="0 0 100 65" fill="none">
        <circle cx="30" cy="38" r="22" fill="white" fill-opacity="0.85" />
        <circle cx="55" cy="28" r="26" fill="white" fill-opacity="0.85" />
        <circle cx="76" cy="40" r="20" fill="white" fill-opacity="0.85" />
        <rect x="22" y="38" width="60" height="20" fill="white" fill-opacity="0.85" rx="4" />
        <ellipse cx="42" cy="34" rx="4.5" ry="5" fill="white" stroke="#B0BEC5" stroke-width="0.5" />
        <circle :cx="42 + px * 0.3" :cy="34.5 + py * 0.3" r="2.2" fill="#546E7A" />
        <circle :cx="40.5 + px * 0.1" :cy="32.5 + py * 0.1" r="0.8" fill="white" />
        <ellipse cx="62" cy="34" rx="4.5" ry="5" fill="white" stroke="#B0BEC5" stroke-width="0.5" />
        <circle :cx="62 + px * 0.3" :cy="34.5 + py * 0.3" r="2.2" fill="#546E7A" />
        <circle :cx="60.5 + px * 0.1" :cy="32.5 + py * 0.1" r="0.8" fill="white" />
        <circle cx="36" cy="42" r="3.5" fill="#FFD1DC" opacity="0.4" />
        <circle cx="68" cy="42" r="3.5" fill="#FFD1DC" opacity="0.4" />
      </svg>

      <!-- Main ticket mascot -->
      <svg class="mascot" viewBox="0 0 160 200" fill="none">
        <defs>
          <mask id="tm-signup">
            <rect width="160" height="200" fill="white" />
            <circle cx="20" cy="105" r="11" fill="black" />
            <circle cx="140" cy="105" r="11" fill="black" />
          </mask>
        </defs>
        <ellipse cx="80" cy="192" rx="48" ry="5" fill="rgba(0,0,0,0.05)" />
        <rect x="20" y="22" width="120" height="155" rx="26" fill="#7EC8E3" mask="url(#tm-signup)" />
        <line x1="32" y1="105" x2="128" y2="105" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4" />
        <ellipse cx="60" cy="78" rx="15" ry="17" fill="white" />
        <circle :cx="60 + px" :cy="80 + py" r="7" fill="#2D3436" />
        <circle :cx="57 + px * 0.3" :cy="76 + py * 0.3" r="2.5" fill="white" />
        <ellipse cx="100" cy="78" rx="15" ry="17" fill="white" />
        <circle :cx="100 + px" :cy="80 + py" r="7" fill="#2D3436" />
        <circle :cx="97 + px * 0.3" :cy="76 + py * 0.3" r="2.5" fill="white" />
        <circle cx="42" cy="98" r="8" fill="#FFB6C1" opacity="0.35" />
        <circle cx="118" cy="98" r="8" fill="#FFB6C1" opacity="0.35" />
        <path d="M70 118 Q80 130 90 118" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <ellipse cx="56" cy="180" rx="14" ry="7" fill="#6BB5D1" />
        <ellipse cx="104" cy="180" rx="14" ry="7" fill="#6BB5D1" />
      </svg>

      <!-- Star character -->
      <svg class="star-char" viewBox="0 0 60 58" fill="none">
        <polygon points="30,3 36,21 55,21 40,32 46,50 30,40 14,50 20,32 5,21 24,21" fill="#FFD93D" />
        <circle cx="23" cy="27" r="3.5" fill="white" />
        <circle :cx="23 + px * 0.35" :cy="27.5 + py * 0.3" r="1.8" fill="#2D3436" />
        <circle :cx="21.8 + px * 0.1" :cy="26 + py * 0.1" r="0.7" fill="white" />
        <circle cx="37" cy="27" r="3.5" fill="white" />
        <circle :cx="37 + px * 0.35" :cy="27.5 + py * 0.3" r="1.8" fill="#2D3436" />
        <circle :cx="35.8 + px * 0.1" :cy="26 + py * 0.1" r="0.7" fill="white" />
        <circle cx="19" cy="33" r="2.5" fill="#FFB6C1" opacity="0.35" />
        <circle cx="41" cy="33" r="2.5" fill="#FFB6C1" opacity="0.35" />
        <path d="M27 35 Q30 39 33 35" stroke="#DAA520" stroke-width="1.2" fill="none" stroke-linecap="round" />
      </svg>

      <div class="play-brand">
        <span class="play-badge">AI Smart Ticketing</span>
        <h2 class="play-title">OpenTraum</h2>
      </div>
    </div>

    <!-- ═══ RIGHT: SIGNUP FORM ═══ -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-card">
      <div class="w-full max-w-md">
        <!-- Mobile mascot -->
        <div class="flex flex-col items-center mb-6 lg:hidden">
          <svg viewBox="0 0 160 200" fill="none" class="w-28 h-auto">
            <defs>
              <mask id="tm-signup-m">
                <rect width="160" height="200" fill="white" />
                <circle cx="20" cy="105" r="11" fill="black" />
                <circle cx="140" cy="105" r="11" fill="black" />
              </mask>
            </defs>
            <rect x="20" y="22" width="120" height="155" rx="26" fill="#7EC8E3" mask="url(#tm-signup-m)" />
            <line x1="32" y1="105" x2="128" y2="105" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-dasharray="5 4" />
            <ellipse cx="60" cy="78" rx="15" ry="17" fill="white" />
            <circle :cx="60 + px" :cy="80 + py" r="7" fill="#2D3436" />
            <circle :cx="57 + px * 0.3" :cy="76 + py * 0.3" r="2.5" fill="white" />
            <ellipse cx="100" cy="78" rx="15" ry="17" fill="white" />
            <circle :cx="100 + px" :cy="80 + py" r="7" fill="#2D3436" />
            <circle :cx="97 + px * 0.3" :cy="76 + py * 0.3" r="2.5" fill="white" />
            <circle cx="42" cy="98" r="8" fill="#FFB6C1" opacity="0.35" />
            <circle cx="118" cy="98" r="8" fill="#FFB6C1" opacity="0.35" />
            <path d="M70 118 Q80 130 90 118" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <ellipse cx="56" cy="180" rx="14" ry="7" fill="#6BB5D1" />
            <ellipse cx="104" cy="180" rx="14" ry="7" fill="#6BB5D1" />
          </svg>
        </div>

        <div class="mb-8 lg:mb-10">
          <h1 class="font-display text-2xl font-bold text-foreground">Create Account</h1>
          <p class="text-sm text-muted-foreground mt-1">OpenTraum에 가입하세요</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <div v-if="error" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">가입 유형</label>
            <div class="grid grid-cols-2 gap-3">
              <button type="button" @click="role = 'CONSUMER'"
                :class="['flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  role === 'CONSUMER' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50']">
                <Ticket class="w-5 h-5" :class="role === 'CONSUMER' ? 'text-primary' : 'text-muted-foreground'" />
                <span class="text-sm font-medium" :class="role === 'CONSUMER' ? 'text-primary' : 'text-foreground'">티켓 구매자</span>
                <span class="text-xs text-muted-foreground">공연 예매</span>
              </button>
              <button type="button" @click="role = 'ORGANIZER'"
                :class="['flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                  role === 'ORGANIZER' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50']">
                <Megaphone class="w-5 h-5" :class="role === 'ORGANIZER' ? 'text-primary' : 'text-muted-foreground'" />
                <span class="text-sm font-medium" :class="role === 'ORGANIZER' ? 'text-primary' : 'text-foreground'">이벤트 주최자</span>
                <span class="text-xs text-muted-foreground">공연 등록 / 관리</span>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-foreground">이름</label>
            <div class="relative">
              <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input id="name" v-model="name" type="text" required placeholder="홍길동"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-foreground">이메일</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input id="email" v-model="email" type="email" required placeholder="name@example.com"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>

          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium text-foreground">전화번호</label>
            <div class="relative">
              <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input id="phone" :value="phone" type="tel" required maxlength="13" placeholder="010-0000-0000" @input="formatPhone"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-foreground">비밀번호</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input id="password" v-model="password" type="password" required placeholder="8자 이상"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>

          <div class="space-y-2">
            <label for="password-confirm" class="text-sm font-medium text-foreground">비밀번호 확인</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input id="password-confirm" v-model="passwordConfirm" type="password" required placeholder="비밀번호를 다시 입력해주세요"
                class="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
            </div>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? '가입 중...' : '회원가입' }}
          </button>

          <p class="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?
            <RouterLink to="/login" class="text-primary font-medium hover:underline">로그인</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══ PAGE ═══ */
.auth-page {
  min-height: calc(100vh - 4rem);
  display: flex;
}

/* ═══ PLAYGROUND ═══ */
.playground {
  width: 50%;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #F0FFF8 0%, #E8FFF4 40%, #F0FFFE 100%);
  overflow: hidden;
}

/* ── Bubbles ── */
.bubble {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.b1 {
  width: 90px; height: 90px;
  background: hsl(350 80% 88% / 0.5);
  top: 8%; left: 6%;
  animation: bfloat 7s ease-in-out infinite alternate;
}
.b2 {
  width: 130px; height: 130px;
  background: hsl(210 70% 88% / 0.4);
  bottom: 12%; right: 5%;
  animation: bfloat 9s ease-in-out infinite alternate-reverse;
}
.b3 {
  width: 60px; height: 60px;
  background: hsl(45 80% 88% / 0.5);
  top: 35%; right: 12%;
  animation: bfloat 6s ease-in-out infinite alternate;
  animation-delay: -2s;
}
.b4 {
  width: 45px; height: 45px;
  background: hsl(160 60% 85% / 0.5);
  bottom: 22%; left: 15%;
  animation: bfloat 8s ease-in-out infinite alternate-reverse;
  animation-delay: -3s;
}
.b5 {
  width: 70px; height: 70px;
  background: hsl(270 60% 90% / 0.35);
  top: 15%; right: 25%;
  animation: bfloat 10s ease-in-out infinite alternate;
  animation-delay: -1s;
}
@keyframes bfloat {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(12px, -18px) scale(1.05); }
  100% { transform: translate(-8px, 10px) scale(0.97); }
}

/* ── Characters ── */
.mascot {
  width: 200px;
  height: auto;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 8px 24px rgba(126, 200, 227, 0.2));
  animation: mascot-idle 3s ease-in-out infinite;
}
.mascot:hover {
  animation: mascot-bounce 0.5s ease;
}
@keyframes mascot-idle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes mascot-bounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.08, 0.94); }
  50% { transform: scale(0.96, 1.04); }
  70% { transform: scale(1.03, 0.98); }
  100% { transform: scale(1); }
}

.cloud-char {
  position: absolute;
  width: 120px;
  top: 14%;
  left: 10%;
  z-index: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.04));
  animation: cloud-float 6s ease-in-out infinite;
}
@keyframes cloud-float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -8px); }
}

.star-char {
  position: absolute;
  width: 65px;
  top: 18%;
  right: 15%;
  z-index: 1;
  filter: drop-shadow(0 3px 10px rgba(255, 217, 61, 0.3));
  animation: star-bob 4s ease-in-out infinite;
}
@keyframes star-bob {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-12px) rotate(5deg); }
}

/* ── Brand ── */
.play-brand {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 32px;
}
.play-badge {
  display: inline-block;
  font-family: 'DM Sans', 'Pretendard', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: hsl(220 50% 55%);
  padding: 5px 14px;
  border: 1px solid hsl(220 40% 80% / 0.5);
  border-radius: 50px;
  background: white;
  margin-bottom: 10px;
}
.play-title {
  font-family: 'Sora', 'Pretendard', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: hsl(220 30% 25%);
  letter-spacing: -0.02em;
  margin: 0;
}
</style>
