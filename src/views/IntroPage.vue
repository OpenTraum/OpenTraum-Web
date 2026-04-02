<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Shield, BarChart3, ArrowRight, Zap } from 'lucide-vue-next'

const router = useRouter()

// ── Mouse tracking ──────────────────────────────────────
const mx = ref(0.5)
const my = ref(0.5)

function onMouse(e: MouseEvent) {
  mx.value = e.clientX / innerWidth
  my.value = e.clientY / innerHeight
}

const showcaseStyle = computed(() => ({
  transform: `perspective(1200px) rotateY(${-8 + (mx.value - 0.5) * 6}deg) rotateX(${3 + (my.value - 0.5) * -4}deg)`,
}))

// ── Phase animation ─────────────────────────────────────
const phase = ref(0)
const leaving = ref(false)

function enter() {
  if (leaving.value) return
  leaving.value = true
  setTimeout(() => router.push('/guide'), 600)
}

function goSignup() {
  if (leaving.value) return
  leaving.value = true
  setTimeout(() => router.push('/signup'), 600)
}

// ── Typing effect ───────────────────────────────────────
const typedText = ref('')
const showCursor = ref(true)
const fullText = 'AI가 이벤트를 설계하고, 공정한 시스템이 판매합니다'

function startTyping() {
  let i = 0
  const iv = setInterval(() => {
    if (i < fullText.length) {
      typedText.value = fullText.slice(0, ++i)
    } else {
      clearInterval(iv)
      setTimeout(() => (showCursor.value = false), 2000)
    }
  }, 40)
}

// ── Lifecycle ──────────────────────────────────────────
function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') enter()
}

onMounted(() => {
  addEventListener('mousemove', onMouse)
  document.addEventListener('keydown', onKey)

  requestAnimationFrame(() => {
    phase.value = 1
    setTimeout(() => (phase.value = 2), 150)
    setTimeout(() => (phase.value = 3), 400)
    setTimeout(() => (phase.value = 4), 700)
    setTimeout(() => {
      phase.value = 5
      startTyping()
    }, 1000)
    setTimeout(() => (phase.value = 6), 1500)
    setTimeout(() => (phase.value = 7), 1900)
    setTimeout(() => (phase.value = 8), 2300)
  })
})

onUnmounted(() => {
  removeEventListener('mousemove', onMouse)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="intro" :class="{ leaving }">
    <!-- ═══ BACKGROUND ═══ -->

    <!-- Gradient mesh blobs -->
    <div class="mesh" :class="{ in: phase >= 1 }">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />
    </div>

    <!-- Dot grid pattern -->
    <div class="dot-grid" />

    <!-- 상단 네비 제거됨 -->

    <!-- ═══ MAIN CONTENT ═══ -->
    <div class="content-wrapper">
      <!-- Left: Hero text -->
      <div class="hero-section">
        <div class="eyebrow" :class="{ in: phase >= 3 }">
          <Sparkles :size="14" />
          <span>AI-Powered Ticketing Platform</span>
        </div>

        <h1 class="hero-title" :class="{ in: phase >= 4 }">
          <span class="title-line">누구나 쉽게</span>
          <span class="title-line">티켓을 판매할 수 있는</span>
          <span class="title-line title-accent">꿈의 플랫폼</span>
        </h1>

        <p class="subtitle" :class="{ in: phase >= 5 }">
          {{ typedText }}<span v-if="showCursor && phase >= 5" class="cursor">|</span>
        </p>

        <div class="cta-group" :class="{ in: phase >= 6 }">
          <button class="cta-primary" @click="goSignup">
            <span>지금 시작하기</span>
            <ArrowRight :size="18" />
          </button>
          <button class="cta-secondary" @click="enter">
            둘러보기
          </button>
        </div>

        <div class="features" :class="{ in: phase >= 7 }">
          <div class="feat-pill">
            <Sparkles :size="14" />
            <span>AI 자동 생성</span>
          </div>
          <div class="feat-pill">
            <Shield :size="14" />
            <span>공정한 배정</span>
          </div>
          <div class="feat-pill">
            <BarChart3 :size="14" />
            <span>실시간 관리</span>
          </div>
        </div>
      </div>

      <!-- Right: Product showcase -->
      <div class="showcase-area" :class="{ in: phase >= 8 }">
        <div class="showcase-float">
          <div class="showcase-card" :style="showcaseStyle">
            <!-- AI Generation Panel -->
            <div class="panel">
              <div class="panel-header">
                <div class="panel-dots">
                  <span /><span /><span />
                </div>
                <div class="panel-title">
                  <Sparkles :size="13" />
                  AI Event Generator
                </div>
              </div>

              <!-- Prompt -->
              <div class="panel-prompt">
                <div class="prompt-label">프롬프트</div>
                <div class="prompt-text">"3월 올림픽홀 콘서트 1000석"</div>
              </div>

              <!-- Generated result -->
              <div class="panel-result">
                <div class="result-badge">
                  <Zap :size="11" />
                  Generated
                </div>
                <div class="result-title">올림픽홀 Spring Concert 2026</div>
                <div class="result-rows">
                  <div class="result-row">
                    <span class="rr-grade vip">VIP</span>
                    <span class="rr-price">₩150,000</span>
                    <span class="rr-seats">200석</span>
                  </div>
                  <div class="result-row">
                    <span class="rr-grade s">S</span>
                    <span class="rr-price">₩120,000</span>
                    <span class="rr-seats">500석</span>
                  </div>
                  <div class="result-row">
                    <span class="rr-grade a">A</span>
                    <span class="rr-price">₩80,000</span>
                    <span class="rr-seats">300석</span>
                  </div>
                </div>
                <div class="result-policy">
                  배정 방식: <strong>DUAL_TRACK</strong>
                </div>
              </div>

              <button class="panel-btn">이벤트 생성하기</button>
            </div>

            <!-- Floating mini ticket -->
            <div class="mini-ticket">
              <div class="mt-badge">VIP</div>
              <div class="mt-event">SPRING<br />CONCERT</div>
              <div class="mt-divider" />
              <div class="mt-meta">
                <span>2026.04.15</span>
                <span>올림픽홀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TICKER ═══ -->
    <div class="ticker" :class="{ in: phase >= 7 }">
      <div class="ticker-track">
        <span v-for="i in 6" :key="i" class="ticker-seg">
          OPEN TRAUM&ensp;·&ensp;AI-POWERED SMART
          TICKETING&ensp;·&ensp;DREAM PLATFORM&ensp;·&ensp;
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ═══ BASE ═══ */
.intro {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: hsl(220 30% 98%);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: opacity 0.6s, transform 0.6s, filter 0.6s;
}
.intro.leaving {
  opacity: 0;
  transform: scale(1.04);
  filter: blur(8px);
}

/* ═══ GRADIENT MESH ═══ */
.mesh {
  position: absolute;
  inset: 0;
  filter: blur(100px);
  opacity: 0;
  transition: opacity 1.5s;
}
.mesh.in { opacity: 1; }

.orb {
  position: absolute;
  border-radius: 50%;
}
.orb-1 {
  top: -15%;
  right: -5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, hsl(220 85% 70% / 0.25), transparent 70%);
  animation: drift-1 20s ease-in-out infinite alternate;
}
.orb-2 {
  bottom: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, hsl(200 80% 72% / 0.2), transparent 70%);
  animation: drift-2 25s ease-in-out infinite alternate;
}
.orb-3 {
  top: 30%;
  left: 40%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, hsl(240 70% 75% / 0.12), transparent 70%);
  animation: drift-3 18s ease-in-out infinite alternate;
}

@keyframes drift-1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-60px, 40px) scale(1.1); }
  100% { transform: translate(30px, -20px) scale(1.05); }
}
@keyframes drift-2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, -30px) scale(1.08); }
  100% { transform: translate(-30px, 20px) scale(0.95); }
}
@keyframes drift-3 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, -40px) scale(1.15); }
  100% { transform: translate(40px, 30px) scale(1); }
}

/* ═══ DOT GRID ═══ */
.dot-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, hsl(220 40% 70% / 0.12) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at 60% 40%, black 20%, transparent 65%);
  -webkit-mask-image: radial-gradient(ellipse at 60% 40%, black 20%, transparent 65%);
}

/* ═══ TOP NAV ═══ */
.top-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 20px 40px;
  opacity: 0;
  transform: translateY(-12px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.top-nav.in {
  opacity: 1;
  transform: translateY(0);
}
.nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo-img {
  height: 120px;
  width: auto;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-link {
  background: none;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: hsl(220 15% 45%);
  cursor: pointer;
  transition: color 0.2s;
}
.nav-link:hover { color: hsl(220 35% 12%); }
.nav-cta {
  height: 38px;
  padding: 0 20px;
  border-radius: 50px;
  border: none;
  background: hsl(220 90% 52%);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}
.nav-cta:hover {
  background: hsl(220 90% 46%);
  box-shadow: 0 4px 20px hsl(220 90% 52% / 0.25);
}

/* ═══ CONTENT WRAPPER ═══ */
.content-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  max-width: 1400px;
  width: 100%;
  padding: 0 40px;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  max-width: 600px;
}

/* ═══ EYEBROW ═══ */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 50px;
  border: 1px solid hsl(220 60% 70% / 0.3);
  background: hsl(220 80% 96%);
  color: hsl(220 90% 45%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  margin-bottom: 24px;
}
.eyebrow.in {
  opacity: 1;
  transform: translateY(0);
}

/* ═══ HERO TITLE ═══ */
.hero-title {
  margin: 0 0 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-title.in {
  opacity: 1;
  transform: translateY(0);
}
.title-line {
  display: block;
  font-family: 'Sora', system-ui, sans-serif;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: hsl(220 35% 12%);
  letter-spacing: -0.02em;
}
.title-accent {
  background: linear-gradient(135deg, hsl(220 90% 50%), hsl(200 85% 48%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ═══ SUBTITLE ═══ */
.subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.95rem, 2vw, 1.2rem);
  color: hsl(220 10% 45%);
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 32px;
  min-height: 1.6em;
  opacity: 0;
  transform: translateY(14px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.subtitle.in {
  opacity: 1;
  transform: translateY(0);
}
.cursor {
  color: hsl(220 90% 52%);
  font-weight: 300;
  animation: blink 0.7s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ═══ CTA GROUP ═══ */
.cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(14px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta-group.in {
  opacity: 1;
  transform: translateY(0);
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
.cta-primary:active { transform: scale(0.97); }
.cta-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
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

/* ═══ FEATURE PILLS ═══ */
.features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  opacity: 0;
  transform: translateY(14px);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.features.in {
  opacity: 1;
  transform: translateY(0);
}

.feat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 50px;
  border: 1px solid hsl(220 20% 88%);
  background: white;
  color: hsl(220 15% 40%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  box-shadow: 0 1px 4px hsl(220 30% 50% / 0.06);
  transition: all 0.2s;
}
.feat-pill:hover {
  border-color: hsl(220 80% 65%);
  color: hsl(220 90% 45%);
  box-shadow: 0 2px 12px hsl(220 80% 50% / 0.1);
}

/* ═══ PRODUCT SHOWCASE ═══ */
.showcase-area {
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(40px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.showcase-area.in {
  opacity: 1;
  transform: translateX(0);
}
.showcase-float {
  animation: showcase-float 6s ease-in-out infinite;
}
@keyframes showcase-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
.showcase-card {
  position: relative;
  transition: transform 0.12s ease-out;
}

/* AI Panel */
.panel {
  width: 340px;
  background: white;
  border: 1px solid hsl(220 20% 90%);
  border-radius: 16px;
  box-shadow:
    0 8px 40px hsl(220 40% 50% / 0.08),
    0 1px 3px hsl(220 30% 50% / 0.06);
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid hsl(220 20% 93%);
  background: hsl(220 30% 98%);
}
.panel-dots {
  display: flex;
  gap: 6px;
}
.panel-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.panel-dots span:nth-child(1) { background: hsl(0 70% 65%); }
.panel-dots span:nth-child(2) { background: hsl(40 80% 60%); }
.panel-dots span:nth-child(3) { background: hsl(140 60% 55%); }

.panel-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: hsl(220 90% 48%);
  letter-spacing: 0.02em;
}

.panel-prompt {
  padding: 16px 18px;
  border-bottom: 1px solid hsl(220 20% 93%);
}
.prompt-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  color: hsl(220 10% 55%);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.prompt-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: hsl(220 35% 15%);
  font-weight: 500;
  padding: 10px 14px;
  background: hsl(220 30% 97%);
  border: 1px solid hsl(220 20% 90%);
  border-radius: 10px;
}

.panel-result {
  padding: 16px 18px;
}
.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 50px;
  background: hsl(145 60% 92%);
  color: hsl(145 60% 35%);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  margin-bottom: 10px;
}
.result-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: hsl(220 35% 12%);
  margin-bottom: 12px;
}
.result-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}
.result-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
}
.rr-grade {
  width: 32px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.rr-grade.vip { background: hsl(220 90% 52%); }
.rr-grade.s { background: hsl(200 70% 50%); }
.rr-grade.a { background: hsl(220 30% 65%); }
.rr-price {
  flex: 1;
  color: hsl(220 35% 15%);
  font-weight: 600;
}
.rr-seats {
  color: hsl(220 10% 50%);
  font-weight: 400;
}
.result-policy {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  color: hsl(220 10% 50%);
  padding-top: 8px;
  border-top: 1px dashed hsl(220 15% 90%);
}
.result-policy strong {
  color: hsl(220 90% 48%);
  font-weight: 600;
}

.panel-btn {
  width: calc(100% - 36px);
  margin: 0 18px 18px;
  height: 38px;
  border-radius: 10px;
  border: none;
  background: hsl(220 90% 52%);
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.panel-btn:hover { background: hsl(220 90% 46%); }

/* Mini ticket */
.mini-ticket {
  position: absolute;
  bottom: -20px;
  right: -30px;
  width: 160px;
  padding: 16px;
  background: white;
  border: 1px solid hsl(220 20% 88%);
  border-radius: 12px;
  box-shadow:
    0 12px 40px hsl(220 40% 50% / 0.12),
    0 2px 6px hsl(220 30% 50% / 0.06);
  animation: ticket-bob 4s ease-in-out infinite;
}
@keyframes ticket-bob {
  0%, 100% { transform: translateY(0) rotate(2deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
}
.mt-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: hsl(220 90% 52%);
  color: white;
  font-family: 'Sora', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.mt-event {
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: hsl(220 35% 12%);
  line-height: 1.1;
  margin-bottom: 8px;
}
.mt-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, hsl(220 20% 85%), transparent);
  margin-bottom: 8px;
}
.mt-meta {
  display: flex;
  justify-content: space-between;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.6rem;
  color: hsl(220 10% 50%);
}

/* ═══ TICKER ═══ */
.ticker {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 0;
  z-index: 12;
  background: white;
  border-top: 1px solid hsl(220 20% 92%);
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.6s 0.2s;
}
.ticker.in { opacity: 1; }
.ticker-track {
  display: flex;
  white-space: nowrap;
  animation: tick-scroll 50s linear infinite;
}
.ticker-seg {
  color: hsl(220 15% 75%);
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
@keyframes tick-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-16.666%); }
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
    gap: 48px;
    padding: 0 32px;
  }
  .hero-section {
    align-items: center;
    text-align: center;
  }
  .title-line {
    font-size: clamp(1.8rem, 5vw, 3rem);
  }
  .features, .cta-group { justify-content: center; }
  .showcase-area { transform: translateY(30px); }
  .showcase-area.in { transform: translateY(0); }
}

@media (max-width: 768px) {
  .showcase-area { display: none; }
  .content-wrapper { padding: 0 24px; }
  .top-nav { padding: 16px 24px; }
}

@media (max-width: 640px) {
  .cta-primary { height: 44px; padding: 0 24px; font-size: 0.9rem; }
  .cta-secondary { height: 44px; padding: 0 22px; font-size: 0.9rem; }
  .feat-pill { padding: 5px 10px; font-size: 0.72rem; }
}
</style>
