<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Loader2, ArrowLeft, Save, PenLine, Plus, Trash2, Upload, X, Building2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import {
  adminEventsApi,
  type AiGenerateResponse,
  type GradeConfig,
  type ZoneConfig,
  type VenuePreset,
} from '@/api/admin.events.api'

const router = useRouter()
const authStore = useAuthStore()

// 모드 토글
type CreateMode = 'ai' | 'manual'
const mode = ref<CreateMode>('ai')
const formReady = ref(false)

// AI 생성
const prompt = ref('')
const aiLoading = ref(false)

// 공연장 프리셋
const venuePresets = ref<VenuePreset[]>([])
const selectedVenueId = ref<number | null>(null)

// 이미지 업로드
const imagePreview = ref<string | null>(null)
const imageUrl = ref<string | null>(null)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

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

// 폼 표시 조건: AI 모드면 생성 후 / 직접 입력이면 항상
const showForm = computed(() => mode.value === 'manual' || formReady.value)

onMounted(async () => {
  try {
    venuePresets.value = await adminEventsApi.getVenues()
  } catch {
    // 프리셋 로드 실패해도 계속 진행
  }
})

// 모드 변경
function switchMode(m: CreateMode) {
  mode.value = m
  if (m === 'manual' && grades.value.length === 0) {
    grades.value = [{ grade: 'R', price: 110000, seatCount: 0 }]
    zones.value = [{ zone: 'A구역', grade: 'R', seatCount: 0 }]
  }
}

// 공연장 프리셋 선택
function applyVenuePreset() {
  const preset = venuePresets.value.find((v) => v.id === selectedVenueId.value)
  if (!preset) return
  venue.value = preset.name
  totalSeats.value = preset.totalSeats
  // zoneConfig → zones 변환
  const entries = Object.entries(preset.zoneConfig)
  const defaultGrade = grades.value[0]?.grade ?? 'R'
  zones.value = entries.map(([zoneName, count]) => ({
    zone: zoneName,
    grade: defaultGrade,
    seatCount: count,
  }))
}

// 등급 행 추가/삭제
function addGrade() {
  grades.value.push({ grade: '', price: 0, seatCount: 0 })
}
function removeGrade(i: number) {
  grades.value.splice(i, 1)
}

// 구역 행 추가/삭제
function addZone() {
  const defaultGrade = grades.value[0]?.grade ?? ''
  zones.value.push({ zone: '', grade: defaultGrade, seatCount: 0 })
}
function removeZone(i: number) {
  zones.value.splice(i, 1)
}

// 이미지 업로드 처리
function handleImageSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) processImage(input.files[0])
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) processImage(file)
}

function processImage(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxW = 1200
      const scale = img.width > maxW ? maxW / img.width : 1
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      imagePreview.value = dataUrl
      imageUrl.value = dataUrl
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  imagePreview.value = null
  imageUrl.value = null
}

// AI 자동 생성
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
    formReady.value = true

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

// 이벤트 생성
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
      imageUrl: imageUrl.value,
      organizerName: authStore.user?.name ?? null,
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

// 공통 input 클래스
const inputCls =
  'w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'
const cellInputCls =
  'w-full h-8 px-2 rounded bg-secondary border border-border text-foreground text-sm'
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 lg:px-8 py-8">
    <!-- 뒤로가기 -->
    <button
      class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      @click="router.push('/admin/events')"
    >
      <ArrowLeft class="w-4 h-4" />
      이벤트 목록
    </button>

    <h1 class="text-2xl font-display font-bold text-foreground mb-8">새 이벤트 생성</h1>

    <!-- 모드 토글 -->
    <div class="flex gap-1 p-1 bg-secondary rounded-lg w-fit mb-8">
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all"
        :class="
          mode === 'ai'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="switchMode('ai')"
      >
        <Sparkles class="w-4 h-4" />
        AI 자동 생성
      </button>
      <button
        class="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all"
        :class="
          mode === 'manual'
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="switchMode('manual')"
      >
        <PenLine class="w-4 h-4" />
        직접 입력
      </button>
    </div>

    <!-- AI 모드: 프롬프트 입력 -->
    <div v-if="mode === 'ai'" class="bg-card border border-border rounded-xl p-6 mb-8">
      <h2 class="text-lg font-display font-semibold text-foreground mb-2 flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-primary" />
        AI 자동 생성
      </h2>
      <p class="text-sm text-muted-foreground mb-4">
        원하는 공연 정보를 자연어로 입력하면 AI가 등급, 구역, 가격, 배정 방식을 자동 구성합니다.
      </p>
      <div class="flex gap-3">
        <input
          v-model="prompt"
          type="text"
          placeholder="예: 4월 올림픽홀 콘서트 2400석"
          :class="[inputCls, 'flex-1 h-11 px-4']"
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
    <form v-if="showForm" @submit.prevent="handleCreate" class="space-y-6">
      <!-- 이미지 업로드 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Upload class="w-5 h-5 text-primary" />
          공연 포스터
        </h2>
        <div v-if="imagePreview" class="relative inline-block">
          <img
            :src="imagePreview"
            alt="포스터 미리보기"
            class="w-48 h-64 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            class="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
            @click="removeImage"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
        <div
          v-else
          class="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
          :class="isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
          @click="fileInput?.click()"
        >
          <Upload class="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p class="text-sm text-muted-foreground">
            클릭하거나 이미지를 드래그하세요
          </p>
          <p class="text-xs text-muted-foreground/60 mt-1">미첨부 시 기본 이미지가 자동 할당됩니다</p>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageSelect" />
      </div>

      <!-- 기본 정보 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-display font-semibold text-foreground mb-4">기본 정보</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">공연 제목</label>
            <input v-model="title" type="text" required :class="inputCls" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">아티스트</label>
            <input v-model="artist" type="text" :class="inputCls" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">공연장</label>
            <div class="flex gap-2">
              <input v-model="venue" type="text" required :class="[inputCls, 'flex-1']" />
              <div v-if="venuePresets.length" class="relative">
                <select
                  v-model="selectedVenueId"
                  :class="[inputCls, 'w-auto pr-8 appearance-none']"
                  @change="applyVenuePreset"
                >
                  <option :value="null" disabled>프리셋</option>
                  <option v-for="vp in venuePresets" :key="vp.id" :value="vp.id">
                    {{ vp.name }} ({{ vp.totalSeats.toLocaleString() }}석)
                  </option>
                </select>
                <Building2
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">총 좌석 수</label>
            <input v-model.number="totalSeats" type="number" required :class="inputCls" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">공연 일시</label>
            <input v-model="dateTime" type="datetime-local" required :class="inputCls" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">배정 방식</label>
            <select v-model="trackPolicy" :class="inputCls">
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
            <input v-model="ticketOpenAt" type="datetime-local" required :class="inputCls" />
          </div>
          <div>
            <label class="block text-sm text-muted-foreground mb-1.5">티켓 마감 일시</label>
            <input v-model="ticketCloseAt" type="datetime-local" required :class="inputCls" />
          </div>
        </div>
      </div>

      <!-- 등급 구성 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-display font-semibold text-foreground">등급 구성</h2>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            @click="addGrade"
          >
            <Plus class="w-4 h-4" />
            등급 추가
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-muted-foreground">
                <th class="text-left py-2 pr-4">등급</th>
                <th class="text-right py-2 pr-4">가격 (원)</th>
                <th class="text-right py-2 pr-4">좌석 수</th>
                <th class="w-10 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(g, i) in grades" :key="i" class="border-b border-border/50">
                <td class="py-2 pr-4">
                  <input v-model="g.grade" type="text" :class="cellInputCls" />
                </td>
                <td class="py-2 pr-4">
                  <input
                    v-model.number="g.price"
                    type="number"
                    :class="[cellInputCls, 'text-right']"
                  />
                </td>
                <td class="py-2 pr-4">
                  <input
                    v-model.number="g.seatCount"
                    type="number"
                    :class="[cellInputCls, 'text-right']"
                  />
                </td>
                <td class="py-2 text-center">
                  <button
                    v-if="grades.length > 1"
                    type="button"
                    class="text-muted-foreground hover:text-destructive transition-colors"
                    @click="removeGrade(i)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 구역 구성 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-display font-semibold text-foreground">구역 구성</h2>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            @click="addZone"
          >
            <Plus class="w-4 h-4" />
            구역 추가
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-muted-foreground">
                <th class="text-left py-2 pr-4">구역</th>
                <th class="text-left py-2 pr-4">등급</th>
                <th class="text-right py-2 pr-4">좌석 수</th>
                <th class="w-10 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(z, i) in zones" :key="i" class="border-b border-border/50">
                <td class="py-2 pr-4">
                  <input v-model="z.zone" type="text" :class="cellInputCls" />
                </td>
                <td class="py-2 pr-4">
                  <select v-model="z.grade" :class="cellInputCls">
                    <option v-for="g in grades" :key="g.grade" :value="g.grade">
                      {{ g.grade }}
                    </option>
                  </select>
                </td>
                <td class="py-2 pr-4">
                  <input
                    v-model.number="z.seatCount"
                    type="number"
                    :class="[cellInputCls, 'text-right']"
                  />
                </td>
                <td class="py-2 text-center">
                  <button
                    v-if="zones.length > 1"
                    type="button"
                    class="text-muted-foreground hover:text-destructive transition-colors"
                    @click="removeZone(i)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
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
