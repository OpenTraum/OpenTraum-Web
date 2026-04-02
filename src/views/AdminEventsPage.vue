<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, BarChart3, Trash2, Calendar, MapPin, Users, Lock, Unlock } from 'lucide-vue-next'
import { adminEventsApi, type AdminEventResponse } from '@/api/admin.events.api'

const router = useRouter()
const events = ref<AdminEventResponse[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    events.value = await adminEventsApi.list()
  } catch (e) {
    console.error('이벤트 목록 조회 실패', e)
  } finally {
    loading.value = false
  }
})

function isEditLocked(event: AdminEventResponse): boolean {
  if (!event.ticketOpenAt) return false
  const openAt = new Date(event.ticketOpenAt)
  const lockAt = new Date(openAt.getTime() - 30 * 60 * 1000)
  return new Date() >= lockAt
}

async function handleDelete(scheduleId: number) {
  if (!confirm('이벤트를 삭제하시겠습니까?')) return
  try {
    await adminEventsApi.delete(scheduleId)
    events.value = events.value.filter(e => e.scheduleId !== scheduleId)
  } catch (e) {
    console.error('삭제 실패', e)
  }
}

const statusLabel: Record<string, string> = {
  UPCOMING: '예정',
  OPEN: '판매중',
  CLOSED: '마감',
  COMPLETED: '완료',
}

const statusColor: Record<string, string> = {
  UPCOMING: 'bg-yellow-500/15 text-yellow-600',
  OPEN: 'bg-green-500/15 text-green-600',
  CLOSED: 'bg-red-500/15 text-red-600',
  COMPLETED: 'bg-gray-500/15 text-gray-600',
}

function formatDateTime(dt: string) {
  return new Date(dt).toLocaleDateString('ko-KR', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-display font-bold text-foreground">이벤트 관리</h1>
      <button
        class="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        @click="router.push('/admin/events/new')"
      >
        <Plus class="w-4 h-4" />
        새 이벤트
      </button>
    </div>

    <div v-if="loading" class="grid gap-4">
      <div v-for="i in 3" :key="i" class="h-24 rounded-xl skeleton" />
    </div>

    <div v-else-if="events.length === 0" class="text-center py-20 text-muted-foreground">
      아직 생성된 이벤트가 없습니다.
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="event in events"
        :key="event.scheduleId"
        class="bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-primary/30 transition-colors"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-display font-semibold text-foreground truncate">
              {{ event.title }}
            </h3>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="statusColor[event.status] || 'bg-gray-500/20 text-gray-400'"
            >
              {{ statusLabel[event.status] || event.status }}
            </span>
            <span class="px-2 py-0.5 rounded text-xs font-mono bg-secondary text-muted-foreground">
              {{ event.trackPolicy }}
            </span>
            <!-- 수정 잠금 표시 -->
            <span
              v-if="isEditLocked(event)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-600"
              title="예매 오픈 30분 전 — 수정 불가"
            >
              <Lock class="w-3 h-3" />
              수정 잠금
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-600"
              title="수정 가능"
            >
              <Unlock class="w-3 h-3" />
              수정 가능
            </span>
          </div>
          <div class="flex items-center gap-4 text-sm text-muted-foreground">
            <span class="flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5" />
              {{ event.venue }}
            </span>
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              {{ new Date(event.dateTime).toLocaleDateString('ko-KR') }}
            </span>
            <span class="flex items-center gap-1">
              <Users class="w-3.5 h-3.5" />
              {{ event.totalSeats?.toLocaleString() }}석
            </span>
            <span v-if="event.ticketOpenAt" class="text-xs">
              오픈: {{ formatDateTime(event.ticketOpenAt) }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 ml-4">
          <button
            class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="대시보드"
            @click="router.push(`/admin/events/${event.scheduleId}`)"
          >
            <BarChart3 class="w-5 h-5" />
          </button>
          <button
            class="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
            title="삭제"
            @click="handleDelete(event.scheduleId)"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
