<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, MapPin, Users, TrendingUp, Ticket } from 'lucide-vue-next'
import { adminEventsApi, type AdminEventResponse, type AdminDashboardResponse } from '@/api/admin.events.api'

const route = useRoute()
const router = useRouter()
const scheduleId = Number(route.params.id)

const event = ref<AdminEventResponse | null>(null)
const dashboard = ref<AdminDashboardResponse | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [e, d] = await Promise.all([
      adminEventsApi.get(scheduleId),
      adminEventsApi.dashboard(scheduleId),
    ])
    event.value = e
    dashboard.value = d
  } catch (e) {
    console.error('조회 실패', e)
  } finally {
    loading.value = false
  }
})

const soldPercent = computed(() => {
  if (!dashboard.value || !dashboard.value.totalSeats) return 0
  return Math.round((dashboard.value.soldSeats / dashboard.value.totalSeats) * 100)
})

const statusLabel: Record<string, string> = {
  UPCOMING: '예정',
  OPEN: '판매중',
  CLOSED: '마감',
  COMPLETED: '완료',
}

const statusColor: Record<string, string> = {
  UPCOMING: 'bg-yellow-500/20 text-yellow-400',
  OPEN: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-red-500/20 text-red-400',
  COMPLETED: 'bg-gray-500/20 text-gray-400',
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 lg:px-8 py-8">
    <button
      class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      @click="router.push('/admin/events')"
    >
      <ArrowLeft class="w-4 h-4" />
      이벤트 목록
    </button>

    <div v-if="loading" class="space-y-4">
      <div class="h-32 rounded-xl skeleton" />
      <div class="h-64 rounded-xl skeleton" />
    </div>

    <template v-else-if="event && dashboard">
      <!-- 이벤트 헤더 -->
      <div class="bg-card border border-border rounded-xl p-6 mb-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-display font-bold text-foreground mb-2">{{ event.title }}</h1>
            <p v-if="event.artist" class="text-muted-foreground">{{ event.artist }}</p>
          </div>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="statusColor[event.status] || 'bg-gray-500/20 text-gray-400'"
          >
            {{ statusLabel[event.status] || event.status }}
          </span>
        </div>
        <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span class="flex items-center gap-1.5">
            <MapPin class="w-4 h-4" /> {{ event.venue }}
          </span>
          <span class="flex items-center gap-1.5">
            <Calendar class="w-4 h-4" /> {{ new Date(event.dateTime).toLocaleString('ko-KR') }}
          </span>
          <span class="flex items-center gap-1.5">
            <Users class="w-4 h-4" /> {{ event.totalSeats?.toLocaleString() }}석
          </span>
          <span class="px-2 py-0.5 rounded text-xs font-mono bg-secondary">
            {{ event.trackPolicy }}
          </span>
        </div>
      </div>

      <!-- 요약 카드 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Ticket class="w-4 h-4" /> 총 좌석
          </div>
          <p class="text-2xl font-display font-bold text-foreground">
            {{ dashboard.totalSeats.toLocaleString() }}
          </p>
        </div>
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <TrendingUp class="w-4 h-4" /> 판매량
          </div>
          <p class="text-2xl font-display font-bold text-green-400">
            {{ dashboard.soldSeats.toLocaleString() }}
          </p>
        </div>
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Users class="w-4 h-4" /> 잔여석
          </div>
          <p class="text-2xl font-display font-bold text-foreground">
            {{ dashboard.availableSeats.toLocaleString() }}
          </p>
        </div>
      </div>

      <!-- 전체 판매율 -->
      <div class="bg-card border border-border rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-display font-semibold text-foreground">판매율</h2>
          <span class="text-2xl font-display font-bold text-primary">{{ soldPercent }}%</span>
        </div>
        <div class="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            class="h-full bg-primary rounded-full transition-all duration-700"
            :style="{ width: `${soldPercent}%` }"
          />
        </div>
      </div>

      <!-- 등급별 현황 -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-display font-semibold text-foreground mb-4">등급별 현황</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-muted-foreground">
                <th class="text-left py-3 pr-4">등급</th>
                <th class="text-right py-3 pr-4">총 좌석</th>
                <th class="text-right py-3 pr-4">판매</th>
                <th class="text-right py-3 pr-4">잔여</th>
                <th class="text-right py-3">판매율</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="stat in dashboard.gradeStats"
                :key="stat.grade"
                class="border-b border-border/50"
              >
                <td class="py-3 pr-4 font-medium text-foreground">{{ stat.grade }}</td>
                <td class="py-3 pr-4 text-right text-muted-foreground">{{ stat.totalSeats.toLocaleString() }}</td>
                <td class="py-3 pr-4 text-right text-green-400">{{ stat.soldSeats.toLocaleString() }}</td>
                <td class="py-3 pr-4 text-right text-foreground">{{ stat.availableSeats.toLocaleString() }}</td>
                <td class="py-3 text-right">
                  <span class="text-primary font-medium">
                    {{ stat.totalSeats > 0 ? Math.round((stat.soldSeats / stat.totalSeats) * 100) : 0 }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
