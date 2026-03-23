<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Loader2, ArrowLeft, Save } from 'lucide-vue-next'
import { adminEventsApi, type AiGenerateResponse, type GradeConfig, type ZoneConfig } from '@/api/admin.events.api'

const router = useRouter()

// AI 생성
const prompt = ref('')
const aiLoading = ref(false)
const aiGenerated = ref(false)

// 폼 상태
const title = ref('')
const artist = ref('')
const venue = ref('')
const dateTime = ref('')
const totalSeats = ref(0)
const trackPolicy = ref('DUAL_TRACK')
const ticketOpenAt = ref('')
const ticketCloseAt = ref('')
const grades = ref<GradeConfig[]>([])
const zones = ref<ZoneConfig[]>([])
const saving = ref(false)

async function handleAiGenerate() {
  if (!prompt.value.trim()) return
  aiLoading.value = true
  try {
    const result: AiGenerateResponse = await adminEventsApi.aiGenerate(prompt.value)
    title.value = result.title
    artist.value = result.artist || ''
    venue.value = result.venue
    dateTime.value = result.dateTime?.replace('T', 'T').slice(0, 16) || ''
    totalSeats.value = result.totalSeats
    trackPolicy.value = result.trackPolicy
    grades.value = result.grades
    zones.value = result.zones
    aiGenerated.value = true

    // ticketOpenAt 기본값: 공연 1시간 전
    if (result.dateTime) {
      const dt = new Date(result.dateTime)
      dt.setHours(dt.getHours() - 1)
      ticketOpenAt.value = dt.toISOString().slice(0, 16)
      const close = new Date(result.dateTime)
      close.setHours(close.getHours() + 2)
      ticketCloseAt.value = close.toISOString().slice(0, 16)
    }
  } catch (e) {
    console.error('AI 생성 실패', e)
    alert('AI 생성에 실패했습니다. 다시 시도해주세요.')
  } finally {
    aiLoading.value = false
  }
}

async function handleCreate() {
  saving.value = true
  try {
    await adminEventsApi.create({
      title: title.value,
      artist: artist.value || null,
      venue: venue.value,
      dateTime: dateTime.value,
      totalSeats: totalSeats.value,
      ticketOpenAt: ticketOpenAt.value,
      ticketCloseAt: ticketCloseAt.value,
      trackPolicy: trackPolicy.value,
      grades: grades.value,
      zones: zones.value,
    })
    router.push('/admin/events')
  } catch (e) {
    console.error('이벤트 생성 실패', e)
    alert('이벤트 생성에 실패했습니다.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 lg:px-8 py-8">
    <button
      class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      @click="router.push('/admin/events')"
    >
      <ArrowLeft class="w-4 h-4" />
      이벤트 목록
    </button>

    <h1 class="text-2xl font-display font-bold text-foreground mb-8">새 이벤트 생성</h1>

    <!-- AI 생성 섹션 -->
    <div class="bg-card border border-border rounded-xl p-6 mb-8">
      <h2 class="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-primary" />
        AI 자동 생성
      </h2>
      <div class="flex gap-3">
        <input
          v-model="prompt"
          type="text"
          placeholder="예: 4월 올림픽홀 BTS 콘서트 2400석"
          class="flex-1 h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          @keydown.enter="handleAiGenerate"
        />
        <button
          class="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          :disabled="aiLoading || !prompt.trim()"
          @click="handleAiGenerate"
        >
          <Loader2 v-if="aiLoading" class="w-4 h-4 animate-spin" />
          <Sparkles v-else class="w-4 h-4" />
          AI 생성
        </button>
      </div>
    </div>

    <!-- 이벤트 폼 -->
    <form v-if="aiGenerated" @submit.prevent="handleCreate" class="space-y-6">
      <!-- 기본 정보 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-display font-semibold text-foreground mb-4">기본 정보</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">공연 제목</label>
            <input v-model="title" type="text" required
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">아티스트</label>
            <input v-model="artist" type="text"
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">공연장</label>
            <input v-model="venue" type="text" required
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">총 좌석 수</label>
            <input v-model.number="totalSeats" type="number" required
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">공연 일시</label>
            <input v-model="dateTime" type="datetime-local" required
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">배정 방식</label>
            <select v-model="trackPolicy"
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="LIVE_ONLY">선착순 (LIVE_ONLY)</option>
              <option value="LOTTERY_ONLY">추첨 (LOTTERY_ONLY)</option>
              <option value="DUAL_TRACK">듀얼 트랙 (DUAL_TRACK)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 판매 설정 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-display font-semibold text-foreground mb-4">판매 설정</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">티켓 오픈 일시</label>
            <input v-model="ticketOpenAt" type="datetime-local" required
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">티켓 마감 일시</label>
            <input v-model="ticketCloseAt" type="datetime-local" required
              class="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
      </div>

      <!-- 등급 구성 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-display font-semibold text-foreground mb-4">등급 구성</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-muted-foreground">
                <th class="text-left py-2 pr-4">등급</th>
                <th class="text-right py-2 pr-4">가격 (원)</th>
                <th class="text-right py-2">좌석 수</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(g, i) in grades" :key="i" class="border-b border-border/50">
                <td class="py-2 pr-4">
                  <input v-model="g.grade" type="text"
                    class="w-full h-8 px-2 rounded bg-secondary border border-border text-foreground text-sm" />
                </td>
                <td class="py-2 pr-4">
                  <input v-model.number="g.price" type="number"
                    class="w-full h-8 px-2 rounded bg-secondary border border-border text-foreground text-sm text-right" />
                </td>
                <td class="py-2">
                  <input v-model.number="g.seatCount" type="number"
                    class="w-full h-8 px-2 rounded bg-secondary border border-border text-foreground text-sm text-right" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 구역 구성 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-display font-semibold text-foreground mb-4">구역 구성</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-muted-foreground">
                <th class="text-left py-2 pr-4">구역</th>
                <th class="text-left py-2 pr-4">등급</th>
                <th class="text-right py-2">좌석 수</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(z, i) in zones" :key="i" class="border-b border-border/50">
                <td class="py-2 pr-4">
                  <input v-model="z.zone" type="text"
                    class="w-full h-8 px-2 rounded bg-secondary border border-border text-foreground text-sm" />
                </td>
                <td class="py-2 pr-4">
                  <input v-model="z.grade" type="text"
                    class="w-full h-8 px-2 rounded bg-secondary border border-border text-foreground text-sm" />
                </td>
                <td class="py-2">
                  <input v-model.number="z.seatCount" type="number"
                    class="w-full h-8 px-2 rounded bg-secondary border border-border text-foreground text-sm text-right" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 생성 버튼 -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          이벤트 생성
        </button>
      </div>
    </form>
  </div>
</template>
