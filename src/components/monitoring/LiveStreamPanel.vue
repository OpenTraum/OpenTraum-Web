<script setup lang="ts">
/**
 * ORGANIZER 어드민 페이지에 박는 라이브 SSE 패널.
 *
 * 표시:
 *   - 접속 상태 (connecting / open / error)
 *   - 이벤트 타입별 최신 1건 카운터 (SeatHeld / PaymentCompleted / ...)
 *   - 최근 30건 타임라인 스트림
 *
 * SSE 의 데이터는 monitoring-service 의 /api/v1/monitoring/stream 에서 옴.
 */
import { computed, watch, ref } from 'vue'
import { Activity, Wifi, WifiOff, RefreshCw } from 'lucide-vue-next'
import { useMonitoringStream, type MonitoringEvent } from '@/composables/useMonitoringStream'

const props = defineProps<{
  tenantId?: string | null
  scheduleId?: number
}>()

const { events, status, errorMessage, reconnectAttempts } = useMonitoringStream({
  tenantId: props.tenantId,
})

const recent = computed(() =>
  [...events.value].reverse().slice(0, 30)
)

// 이벤트 타입별 카운터 (전체 누적)
const counters = computed(() => {
  const c: Record<string, number> = {}
  for (const e of events.value) {
    const k = e.eventType ?? 'unknown'
    c[k] = (c[k] ?? 0) + 1
  }
  return c
})

const statusColor = computed(() => {
  switch (status.value) {
    case 'open':       return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
    case 'connecting': return 'bg-blue-500/15 text-blue-700 border-blue-500/30'
    case 'error':      return 'bg-rose-500/15 text-rose-700 border-rose-500/30'
    default:           return 'bg-zinc-500/15 text-zinc-700 border-zinc-500/30'
  }
})

const statusLabel = computed(() => {
  switch (status.value) {
    case 'open':       return 'LIVE'
    case 'connecting': return 'CONNECTING'
    case 'error':      return 'RETRYING'
    default:           return 'CLOSED'
  }
})

const eventTypeStyle: Record<string, string> = {
  SeatHeld: 'bg-amber-500/12 text-amber-700 border-amber-500/30',
  SeatReleased: 'bg-zinc-500/12 text-zinc-700 border-zinc-500/30',
  SeatConfirmed: 'bg-emerald-500/12 text-emerald-700 border-emerald-500/30',
  PaymentRequested: 'bg-blue-500/12 text-blue-700 border-blue-500/30',
  PaymentCompleted: 'bg-green-500/12 text-green-700 border-green-500/30',
  PaymentFailed: 'bg-rose-500/12 text-rose-700 border-rose-500/30',
  RefundCompleted: 'bg-orange-500/12 text-orange-700 border-orange-500/30',
  ReservationConfirmed: 'bg-purple-500/12 text-purple-700 border-purple-500/30',
  ReservationCancelled: 'bg-pink-500/12 text-pink-700 border-pink-500/30',
}

function styleFor(type: string | null) {
  return eventTypeStyle[type ?? ''] ?? 'bg-zinc-500/12 text-zinc-700 border-zinc-500/30'
}

function shortPayload(e: MonitoringEvent): string {
  const p = e.payload ?? {}
  // 흥미로운 필드만 추출
  const keys = ['scheduleId', 'seatId', 'reservationId', 'amount', 'status']
  const parts: string[] = []
  for (const k of keys) {
    if (k in p) parts.push(`${k}=${String((p as Record<string, unknown>)[k])}`)
  }
  return parts.join(' · ') || '—'
}

function fmtTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('ko-KR', { hour12: false })
  } catch {
    return iso
  }
}

// 새 이벤트 도착 시 최상단 깜빡임용
const flashId = ref<string | null>(null)
watch(() => events.value.length, () => {
  const last = events.value[events.value.length - 1]
  if (last) {
    flashId.value = last.eventId ?? `${last.timestamp}`
    setTimeout(() => { flashId.value = null }, 700)
  }
})
</script>

<template>
  <div class="rounded-lg border border-border bg-card overflow-hidden">
    <!-- header -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
      <div class="flex items-center gap-2">
        <Activity class="w-4 h-4 text-primary" />
        <h3 class="font-semibold text-sm">실시간 SAGA 이벤트 스트림</h3>
        <span class="text-[10px] font-mono text-muted-foreground">via SSE</span>
      </div>
      <div class="flex items-center gap-2">
        <div
          class="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest border"
          :class="statusColor"
        >
          <component :is="status === 'open' ? Wifi : WifiOff" class="inline w-3 h-3 mr-1" />
          {{ statusLabel }}
          <span v-if="status === 'error' && reconnectAttempts > 0" class="ml-1 text-[9px]">
            (#{{ reconnectAttempts }})
          </span>
        </div>
      </div>
    </div>

    <!-- counters -->
    <div class="px-5 py-3 border-b border-border bg-muted/10">
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(count, type) in counters"
          :key="type"
          class="text-[11px] px-2 py-0.5 rounded border font-mono"
          :class="styleFor(type)"
        >
          {{ type }} <span class="font-bold ml-1">{{ count }}</span>
        </span>
        <span v-if="!Object.keys(counters).length" class="text-[11px] text-muted-foreground italic">
          이벤트 대기 중...
        </span>
      </div>
      <div v-if="errorMessage" class="mt-2 text-[10px] text-rose-600 font-mono">
        {{ errorMessage }}
      </div>
    </div>

    <!-- timeline -->
    <div class="max-h-[360px] overflow-y-auto">
      <div v-if="!recent.length" class="px-5 py-8 text-center text-sm text-muted-foreground">
        <RefreshCw class="w-5 h-5 mx-auto mb-2 animate-spin" />
        <div>SAGA 이벤트가 발생하면 여기에 실시간으로 표시됩니다.</div>
        <div class="text-[10px] mt-1 font-mono">tenantId: {{ tenantId ?? '(전체)' }}</div>
      </div>
      <ul v-else class="divide-y divide-border">
        <li
          v-for="e in recent"
          :key="(e.eventId ?? '') + e.timestamp"
          class="px-5 py-2.5 flex items-center gap-3 transition"
          :class="(flashId && (e.eventId === flashId)) ? 'bg-amber-100/50' : ''"
        >
          <span class="text-[10px] font-mono text-muted-foreground tabular-nums w-16">
            {{ fmtTime(e.timestamp) }}
          </span>
          <span
            class="text-[10px] px-2 py-0.5 rounded border font-mono whitespace-nowrap"
            :class="styleFor(e.eventType)"
          >
            {{ e.eventType ?? 'outbox' }}
          </span>
          <span class="text-[10px] text-muted-foreground font-mono truncate">
            {{ shortPayload(e) }}
          </span>
          <span class="ml-auto text-[9px] font-mono text-muted-foreground/60 truncate max-w-[120px]">
            saga: {{ e.sagaId?.slice(0, 8) ?? '—' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
