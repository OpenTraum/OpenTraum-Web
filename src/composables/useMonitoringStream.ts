/**
 * monitoring-service SSE 구독 composable.
 *
 * 사용:
 *   const { events, status, latestByEventType } = useMonitoringStream({
 *     tenantId: org.tenantId,
 *     // topic: 'opentraum.payment',
 *     // eventType: 'PaymentCompleted',
 *   })
 */
import { ref, shallowRef, onMounted, onBeforeUnmount, computed } from 'vue'

export interface MonitoringEvent {
  topic: string
  sagaId: string | null
  eventId: string | null
  eventType: string | null
  aggregateId: string | null
  tenantId: string | null
  payload: Record<string, unknown>
  timestamp: string
}

export type StreamStatus = 'connecting' | 'open' | 'error' | 'closed'

interface Options {
  tenantId?: string | null
  topic?: string | null
  eventType?: string | null
  /** 최신 N 건만 events 에 보관 (기본 200) */
  bufferSize?: number
  /** SSE base path (기본 /api/v1/monitoring/stream) */
  endpoint?: string
}

export function useMonitoringStream(opts: Options = {}) {
  const events = shallowRef<MonitoringEvent[]>([])
  const status = ref<StreamStatus>('connecting')
  const errorMessage = ref<string | null>(null)
  const reconnectAttempts = ref(0)
  const buffer = opts.bufferSize ?? 200

  let es: EventSource | null = null
  let stopped = false

  function buildUrl() {
    const base = opts.endpoint ?? '/api/v1/monitoring/stream'
    const params: string[] = []
    if (opts.tenantId) params.push(`tenantId=${encodeURIComponent(opts.tenantId)}`)
    if (opts.topic) params.push(`topic=${encodeURIComponent(opts.topic)}`)
    if (opts.eventType) params.push(`eventType=${encodeURIComponent(opts.eventType)}`)
    return params.length ? `${base}?${params.join('&')}` : base
  }

  function connect() {
    if (stopped) return
    status.value = 'connecting'
    errorMessage.value = null
    try {
      es = new EventSource(buildUrl())
    } catch (e) {
      status.value = 'error'
      errorMessage.value = (e as Error).message
      scheduleReconnect()
      return
    }

    es.onopen = () => {
      status.value = 'open'
      reconnectAttempts.value = 0
    }

    es.onmessage = (e) => pushEvent(e.data)

    // 서버가 event: SeatHeld / PaymentCompleted 같은 이름을 붙이므로 catch-all
    const eventNames = [
      'SeatHeld', 'SeatReleased', 'SeatConfirmed',
      'PaymentRequested', 'PaymentCompleted', 'PaymentFailed', 'RefundCompleted',
      'ReservationConfirmed', 'ReservationCancelled',
      'outbox',
    ]
    for (const name of eventNames) {
      es.addEventListener(name, (e: MessageEvent) => pushEvent(e.data))
    }

    es.onerror = () => {
      status.value = 'error'
      es?.close()
      es = null
      scheduleReconnect()
    }
  }

  function pushEvent(raw: string) {
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as MonitoringEvent
      const next = [...events.value, parsed]
      if (next.length > buffer) next.splice(0, next.length - buffer)
      events.value = next
    } catch (e) {
      // keepalive comment / invalid JSON 은 무시
    }
  }

  function scheduleReconnect() {
    if (stopped) return
    reconnectAttempts.value++
    const delay = Math.min(1000 * 2 ** reconnectAttempts.value, 30_000)
    setTimeout(() => {
      if (!stopped) connect()
    }, delay)
  }

  function disconnect() {
    stopped = true
    if (es) {
      es.close()
      es = null
    }
    status.value = 'closed'
  }

  onMounted(connect)
  onBeforeUnmount(disconnect)

  /** eventType별로 가장 최근 1건만 추출 (좌석맵 status 갱신용) */
  const latestByEventType = computed(() => {
    const out: Record<string, MonitoringEvent> = {}
    for (const e of events.value) {
      const k = e.eventType ?? 'unknown'
      out[k] = e  // 뒤로 갈수록 더 최신
    }
    return out
  })

  return { events, status, errorMessage, reconnectAttempts, latestByEventType, disconnect }
}
