<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Calendar, MapPin, Users, TrendingUp, Ticket,
  Brain, RefreshCw, AlertTriangle, Lightbulb, Zap, ShieldAlert,
  DollarSign, Shuffle, AlertCircle, Megaphone,
} from 'lucide-vue-next'
import {
  adminEventsApi,
  type AdminEventResponse,
  type AdminDashboardResponse,
  type AdminInsightResponse,
} from '@/api/admin.events.api'
import LiveStreamPanel from '@/components/monitoring/LiveStreamPanel.vue'

const route = useRoute()
const router = useRouter()
const scheduleId = Number(route.params.id)

const event = ref<AdminEventResponse | null>(null)
const dashboard = ref<AdminDashboardResponse | null>(null)
const insight = ref<AdminInsightResponse | null>(null)
const loading = ref(true)
const insightLoading = ref(false)

onMounted(async () => {
  try {
    const [e, d] = await Promise.all([
      adminEventsApi.get(scheduleId),
      adminEventsApi.dashboard(scheduleId),
    ])
    event.value = e
    dashboard.value = d
    loadInsights()
  } catch (e) {
    console.error('조회 실패', e)
  } finally {
    loading.value = false
  }
})

async function loadInsights() {
  insightLoading.value = true
  try {
    insight.value = await adminEventsApi.getInsights(scheduleId)
  } catch (e) {
    console.error('인사이트 조회 실패', e)
  } finally {
    insightLoading.value = false
  }
}

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
  UPCOMING: 'bg-yellow-500/15 text-yellow-600',
  OPEN: 'bg-green-500/15 text-green-600',
  CLOSED: 'bg-red-500/15 text-red-600',
  COMPLETED: 'bg-gray-500/15 text-gray-600',
}

const riskConfig: Record<string, { label: string; cls: string; icon: typeof ShieldAlert }> = {
  LOW: { label: '안정', cls: 'bg-green-500/15 text-green-600 border-green-500/30', icon: ShieldAlert },
  MEDIUM: { label: '주의', cls: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30', icon: AlertTriangle },
  HIGH: { label: '경고', cls: 'bg-orange-500/15 text-orange-600 border-orange-500/30', icon: AlertCircle },
  CRITICAL: { label: '위험', cls: 'bg-red-500/15 text-red-600 border-red-500/30', icon: Zap },
}

const actionIcons: Record<string, typeof DollarSign> = {
  PRICE_ADJUST: DollarSign,
  TRACK_CHANGE: Shuffle,
  CAPACITY_WARNING: AlertTriangle,
  MARKETING: Megaphone,
}

const urgencyColor: Record<string, string> = {
  LOW: 'bg-blue-500/15 text-blue-600',
  MEDIUM: 'bg-yellow-500/15 text-yellow-600',
  HIGH: 'bg-red-500/15 text-red-600',
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
          <p class="text-2xl font-display font-bold text-green-600">
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

      <!-- 라이브 SAGA 이벤트 스트림 (SSE — monitoring-service) -->
      <div class="mb-6">
        <LiveStreamPanel :tenant-id="event.tenantId" :schedule-id="scheduleId" />
      </div>

      <!-- AI 운영 인사이트 -->
      <div class="bg-card border border-border rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <Brain class="w-5 h-5 text-primary" />
            AI 운영 인사이트
          </h2>
          <div class="flex items-center gap-3">
            <span
              v-if="insight"
              class="px-3 py-1 rounded-full text-xs font-semibold border"
              :class="riskConfig[insight.riskLevel]?.cls"
            >
              {{ riskConfig[insight.riskLevel]?.label || insight.riskLevel }}
            </span>
            <button
              class="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              :disabled="insightLoading"
              title="분석 갱신"
              @click="loadInsights"
            >
              <RefreshCw class="w-4 h-4" :class="insightLoading ? 'animate-spin' : ''" />
            </button>
          </div>
        </div>

        <!-- 로딩 -->
        <div v-if="insightLoading && !insight" class="space-y-3">
          <div class="h-5 w-3/4 skeleton rounded" />
          <div class="h-5 w-1/2 skeleton rounded" />
          <div class="h-5 w-2/3 skeleton rounded" />
        </div>

        <!-- 인사이트 내용 -->
        <template v-else-if="insight">
          <!-- 핵심 분석 -->
          <div class="space-y-2 mb-5">
            <div
              v-for="(text, i) in insight.insights"
              :key="i"
              class="flex items-start gap-2.5 text-sm text-foreground"
            >
              <Lightbulb class="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <span>{{ text }}</span>
            </div>
          </div>

          <!-- 추천 액션 -->
          <div v-if="insight.actions.length" class="border-t border-border pt-4">
            <h3 class="text-sm font-semibold text-muted-foreground mb-3">추천 액션</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="(action, i) in insight.actions"
                :key="i"
                class="bg-secondary/50 border border-border rounded-lg p-4"
              >
                <div class="flex items-center gap-2 mb-2">
                  <component
                    :is="actionIcons[action.type] || Lightbulb"
                    class="w-4 h-4 text-primary"
                  />
                  <span class="text-sm font-semibold text-foreground">{{ action.title }}</span>
                  <span
                    class="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    :class="urgencyColor[action.urgency]"
                  >
                    {{ action.urgency }}
                  </span>
                </div>
                <p class="text-xs text-muted-foreground leading-relaxed">{{ action.description }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- 실패 -->
        <div v-else class="text-sm text-muted-foreground text-center py-4">
          인사이트를 불러올 수 없습니다. 다시 시도해주세요.
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
                <td class="py-3 pr-4 text-right text-green-600">{{ stat.soldSeats.toLocaleString() }}</td>
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
