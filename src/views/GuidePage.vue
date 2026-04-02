<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight, Sparkles, PenLine, Brain,
  Search, Ticket, CreditCard, Building2, Users, Shield, Zap,
  ChevronDown,
} from 'lucide-vue-next'

const router = useRouter()

// ── Mouse parallax ──
const mx = ref(0.5)
const my = ref(0.5)
function onMouse(e: MouseEvent) {
  mx.value = e.clientX / innerWidth
  my.value = e.clientY / innerHeight
}

// ── Scroll reveal ──
const visible = ref(new Set<string>())
let observer: IntersectionObserver

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  addEventListener('mousemove', onMouse)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          visible.value.add((e.target as HTMLElement).dataset.reveal!)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  removeEventListener('mousemove', onMouse)
  observer?.disconnect()
})

const organizerSteps = [
  { icon: Building2, num: '01', title: '주최자로 가입', desc: '이메일과 조직명으로 가입하면 전용 테넌트가 자동 생성됩니다. 격리된 나만의 티켓팅 공간이 즉시 준비됩니다.', accent: 'hsl(220 90% 52%)' },
  { icon: Sparkles, num: '02', title: 'AI로 이벤트 생성', desc: '"올림픽홀 콘서트 500석" 한 줄이면 AI가 등급, 구역, 가격, 배정 방식, 카테고리까지 자동 구성합니다.', accent: 'hsl(260 80% 60%)' },
  { icon: PenLine, num: '03', title: '직접 커스터마이징', desc: '공연장 프리셋으로 빠르게, 또는 등급과 구역을 자유롭게 추가·삭제. AI 제안을 기반으로 세밀하게 조정하세요.', accent: 'hsl(165 70% 42%)' },
  { icon: Brain, num: '04', title: 'AI 운영 인사이트', desc: '실시간 판매 데이터를 AI가 분석하여 병목 예측, 위험도 판별, 가격 전략까지 자연어로 제안합니다.', accent: 'hsl(30 85% 55%)' },
]

const consumerSteps = [
  { icon: Search, num: '01', title: '공연 탐색', desc: '콘서트, 스포츠, 뮤지컬 등 카테고리로 원하는 이벤트를 빠르게 찾으세요.', accent: 'hsl(340 75% 55%)' },
  { icon: Shield, num: '02', title: '공정한 대기열', desc: '선착순 · 추첨 · 듀얼 트랙 — 주최자가 선택한 공정한 배정 방식으로 기회를 보장합니다.', accent: 'hsl(220 90% 52%)' },
  { icon: Ticket, num: '03', title: '좌석 선택', desc: '실시간 좌석 현황을 보면서 원하는 자리를 골라 바로 예매합니다.', accent: 'hsl(165 70% 42%)' },
  { icon: CreditCard, num: '04', title: '간편 결제', desc: '카드, 간편결제 등 다양한 수단으로 5분 내 안전하게 결제 완료.', accent: 'hsl(220 15% 40%)' },
]
</script>

<template>
  <div class="guide">
    <!-- ═══ BACKGROUND ═══ -->
    <div class="mesh">
      <div
        class="orb orb-1"
        :style="{ transform: `translate(${(mx - 0.5) * -30}px, ${(my - 0.5) * -20}px)` }"
      />
      <div
        class="orb orb-2"
        :style="{ transform: `translate(${(mx - 0.5) * 20}px, ${(my - 0.5) * 15}px)` }"
      />
      <div
        class="orb orb-3"
        :style="{ transform: `translate(${(mx - 0.5) * -15}px, ${(my - 0.5) * 25}px)` }"
      />
    </div>
    <div class="dot-grid" />

    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <div class="hero-inner">
        <div data-reveal="badge" class="hero-badge" :class="{ in: visible.has('badge') }">
          <Sparkles :size="14" />
          <span>서비스 가이드</span>
        </div>

        <h1 data-reveal="title" class="hero-title" :class="{ in: visible.has('title') }">
          <span class="line">OpenTraum은</span>
          <span class="line accent">이렇게 작동합니다</span>
        </h1>

        <p data-reveal="sub" class="hero-sub" :class="{ in: visible.has('sub') }">
          AI가 이벤트를 설계하고, 공정한 시스템이 티켓을 배분합니다.<br />
          주최자와 소비자, 모두를 위한 스마트 티켓팅 플랫폼.
        </p>

        <button
          data-reveal="scroll-hint"
          class="scroll-hint"
          :class="{ in: visible.has('scroll-hint') }"
          @click="scrollTo('organizer')"
        >
          <span>스크롤하여 알아보기</span>
          <ChevronDown :size="18" class="bounce" />
        </button>
      </div>
    </section>

    <!-- ═══ ORGANIZER FLOW ═══ -->
    <section id="organizer" class="flow-section">
      <div class="flow-header" data-reveal="org-head" :class="{ in: visible.has('org-head') }">
        <div class="flow-icon" style="background: hsl(220 90% 52%)">
          <Building2 :size="22" />
        </div>
        <div>
          <h2 class="flow-title">공연 주최자</h2>
          <p class="flow-desc">이벤트를 만들고 AI와 함께 운영하는 흐름</p>
        </div>
      </div>

      <div class="steps-grid">
        <div
          v-for="(step, i) in organizerSteps"
          :key="i"
          :data-reveal="`org-${i}`"
          class="step-card"
          :class="{ in: visible.has(`org-${i}`) }"
          :style="{ '--delay': `${i * 120}ms`, '--accent': step.accent }"
        >
          <div class="step-num">{{ step.num }}</div>
          <div class="step-icon-wrap">
            <component :is="step.icon" :size="28" />
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
          <div class="step-glow" />
        </div>
      </div>
    </section>

    <!-- ═══ DIVIDER ═══ -->
    <div class="divider" data-reveal="divider" :class="{ in: visible.has('divider') }">
      <div class="divider-line" />
      <div class="divider-badge">
        <Zap :size="16" />
        <span>멀티테넌시 — 각 주최자의 데이터는 완벽하게 격리됩니다</span>
      </div>
      <div class="divider-line" />
    </div>

    <!-- ═══ CONSUMER FLOW ═══ -->
    <section class="flow-section">
      <div class="flow-header" data-reveal="con-head" :class="{ in: visible.has('con-head') }">
        <div class="flow-icon" style="background: hsl(165 70% 42%)">
          <Users :size="22" />
        </div>
        <div>
          <h2 class="flow-title">티켓 소비자</h2>
          <p class="flow-desc">공연을 발견하고 예매하는 흐름</p>
        </div>
      </div>

      <div class="steps-grid">
        <div
          v-for="(step, i) in consumerSteps"
          :key="i"
          :data-reveal="`con-${i}`"
          class="step-card"
          :class="{ in: visible.has(`con-${i}`) }"
          :style="{ '--delay': `${i * 120}ms`, '--accent': step.accent }"
        >
          <div class="step-num">{{ step.num }}</div>
          <div class="step-icon-wrap">
            <component :is="step.icon" :size="28" />
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
          <div class="step-glow" />
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="cta-section" data-reveal="cta" :class="{ in: visible.has('cta') }">
      <h2 class="cta-title">
        준비되셨나요?
      </h2>
      <p class="cta-sub">지금 바로 가입하고 AI가 만드는 스마트 티켓팅을 경험하세요.</p>
      <div class="cta-buttons">
        <button class="cta-primary" @click="router.push('/signup')">
          <span>시작하기</span>
          <ArrowRight :size="18" />
        </button>
      </div>
    </section>

    <!-- ═══ TICKER ═══ -->
    <div class="ticker">
      <div class="ticker-track">
        <span v-for="i in 8" :key="i" class="ticker-seg">
          OPEN TRAUM&ensp;·&ensp;AI-POWERED SMART
          TICKETING&ensp;·&ensp;DREAM PLATFORM&ensp;·&ensp;
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══ BASE ═══ */
.guide {
  position: relative;
  min-height: 100vh;
  background: hsl(220 30% 98%);
  overflow-x: hidden;
}

/* ═══ GRADIENT MESH ═══ */
.mesh {
  position: fixed;
  inset: 0;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}
.orb {
  position: absolute;
  border-radius: 50%;
  transition: transform 0.3s ease-out;
}
.orb-1 {
  top: -10%;
  right: -5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, hsl(220 85% 70% / 0.2), transparent 70%);
  animation: drift-1 20s ease-in-out infinite alternate;
}
.orb-2 {
  bottom: 20%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, hsl(260 70% 72% / 0.15), transparent 70%);
  animation: drift-2 25s ease-in-out infinite alternate;
}
.orb-3 {
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, hsl(165 60% 65% / 0.12), transparent 70%);
  animation: drift-3 18s ease-in-out infinite alternate;
}

@keyframes drift-1 {
  0% { translate: 0 0; scale: 1; }
  50% { translate: -60px 40px; scale: 1.1; }
  100% { translate: 30px -20px; scale: 1.05; }
}
@keyframes drift-2 {
  0% { translate: 0 0; scale: 1; }
  50% { translate: 50px -30px; scale: 1.08; }
  100% { translate: -30px 20px; scale: 0.95; }
}
@keyframes drift-3 {
  0% { translate: 0 0; scale: 1; }
  50% { translate: -30px -40px; scale: 1.15; }
  100% { translate: 40px 30px; scale: 1; }
}

/* ═══ DOT GRID ═══ */
.dot-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: radial-gradient(circle, hsl(220 40% 70% / 0.1) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at 50% 30%, black 10%, transparent 60%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 30%, black 10%, transparent 60%);
}

/* ═══ HERO ═══ */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
}
.hero-inner {
  text-align: center;
  max-width: 800px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: 50px;
  border: 1px solid hsl(220 60% 70% / 0.3);
  background: hsl(220 80% 96%);
  color: hsl(220 90% 45%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 28px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-badge.in { opacity: 1; transform: translateY(0); }

.hero-title {
  margin: 0 0 24px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}
.hero-title.in { opacity: 1; transform: translateY(0); }
.hero-title .line {
  display: block;
  font-family: 'Sora', system-ui, sans-serif;
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  font-weight: 700;
  line-height: 1.15;
  color: hsl(220 35% 12%);
  letter-spacing: -0.03em;
}
.hero-title .accent {
  background: linear-gradient(135deg, hsl(220 90% 50%), hsl(260 80% 58%), hsl(200 85% 48%));
  background-size: 200% 200%;
  animation: gradient-shift 4s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: hsl(220 10% 45%);
  line-height: 1.7;
  margin: 0 0 48px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}
.hero-sub.in { opacity: 1; transform: translateY(0); }

.scroll-hint {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: hsl(220 10% 55%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;
}
.scroll-hint.in { opacity: 1; transform: translateY(0); }
.scroll-hint:hover { color: hsl(220 90% 52%); }
.bounce {
  animation: bounce-down 1.5s ease-in-out infinite;
}
@keyframes bounce-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* ═══ FLOW SECTION ═══ */
.flow-section {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px 80px;
}

.flow-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.flow-header.in { opacity: 1; transform: translateX(0); }

.flow-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}
.flow-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: hsl(220 35% 12%);
  margin: 0;
}
.flow-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: hsl(220 10% 50%);
  margin: 2px 0 0;
}

/* ═══ STEP CARDS ═══ */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.step-card {
  position: relative;
  background: white;
  border: 1px solid hsl(220 20% 90%);
  border-radius: 20px;
  padding: 32px 28px;
  overflow: hidden;
  cursor: default;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}
.step-card.in {
  opacity: 1;
  transform: translateY(0);
}
.step-card:hover {
  border-color: var(--accent);
  box-shadow: 0 8px 40px hsl(220 40% 50% / 0.08), 0 0 0 1px var(--accent);
  transform: translateY(-4px);
}
.step-card:hover .step-glow {
  opacity: 1;
}
.step-card:hover .step-icon-wrap {
  background: var(--accent);
  color: white;
  transform: scale(1.1) rotate(-4deg);
}

.step-num {
  position: absolute;
  top: 20px;
  right: 24px;
  font-family: 'Sora', sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  color: hsl(220 20% 93%);
  line-height: 1;
  pointer-events: none;
  transition: color 0.3s;
}
.step-card:hover .step-num {
  color: hsl(220 20% 88%);
}

.step-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: hsl(220 30% 96%);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: hsl(220 35% 12%);
  margin: 0 0 10px;
}
.step-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  color: hsl(220 10% 48%);
  line-height: 1.6;
  margin: 0;
}

.step-glow {
  position: absolute;
  bottom: -40%;
  left: -20%;
  width: 140%;
  height: 80%;
  background: radial-gradient(ellipse, var(--accent), transparent 70%);
  opacity: 0;
  filter: blur(60px);
  transition: opacity 0.5s;
  pointer-events: none;
  z-index: -1;
}

/* ═══ DIVIDER ═══ */
.divider {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.divider.in { opacity: 1; }
.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, hsl(220 20% 85%), transparent);
}
.divider-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  background: white;
  border: 1px solid hsl(220 20% 88%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  color: hsl(220 10% 45%);
  box-shadow: 0 2px 12px hsl(220 30% 50% / 0.06);
  white-space: nowrap;
}

/* ═══ CTA ═══ */
.cta-section {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 80px 40px 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta-section.in { opacity: 1; transform: translateY(0); }

.cta-title {
  font-family: 'Sora', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  color: hsl(220 35% 12%);
  margin: 0 0 12px;
}
.cta-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  color: hsl(220 10% 50%);
  margin: 0 0 32px;
}
.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 32px;
  border-radius: 50px;
  border: none;
  background: hsl(220 90% 52%);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 24px hsl(220 90% 52% / 0.25);
  transition: all 0.3s;
}
.cta-primary:hover {
  background: hsl(220 90% 46%);
  box-shadow: 0 8px 36px hsl(220 90% 52% / 0.35);
  transform: translateY(-2px);
}
.cta-primary::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}
.cta-primary:hover::after { left: 100%; }

.cta-secondary {
  height: 48px;
  padding: 0 28px;
  border-radius: 50px;
  border: 1.5px solid hsl(220 20% 85%);
  background: white;
  color: hsl(220 35% 20%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cta-secondary:hover {
  border-color: hsl(220 60% 70%);
  background: hsl(220 60% 97%);
}

/* ═══ TICKER ═══ */
.ticker {
  position: relative;
  z-index: 1;
  padding: 14px 0;
  background: white;
  border-top: 1px solid hsl(220 20% 92%);
  overflow: hidden;
}
.ticker-track {
  display: flex;
  white-space: nowrap;
  animation: tick-scroll 50s linear infinite;
}
.ticker-seg {
  color: hsl(220 15% 78%);
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
@keyframes tick-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-12.5%); }
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .hero { padding: 0 24px; }
  .flow-section { padding: 40px 24px 60px; }
  .steps-grid { grid-template-columns: 1fr; }
  .divider { padding: 0 24px; }
  .divider-badge { font-size: 0.7rem; padding: 8px 14px; }
  .cta-section { padding: 60px 24px 40px; }
}

@media (max-width: 480px) {
  .hero-title .line { font-size: 2rem; }
  .step-card { padding: 24px 20px; }
}
</style>
