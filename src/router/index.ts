import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: () => import('@/views/IntroPage.vue'),
      meta: { fullscreen: true },
    },
    {
      path: '/concerts',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupPage.vue'),
    },
    {
      path: '/concerts/:id',
      name: 'concert-detail',
      component: () => import('@/views/ConcertDetailPage.vue'),
    },
    {
      path: '/queue/:concertId',
      name: 'queue',
      component: () => import('@/views/QueuePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/lottery/:concertId',
      name: 'lottery',
      component: () => import('@/views/LotteryPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/seats/:concertId',
      name: 'seats',
      component: () => import('@/views/SeatsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/payment/result',
      name: 'payment-result',
      component: () => import('@/views/PaymentResultPage.vue'),
    },
    {
      path: '/payment/:reservationId',
      name: 'payment',
      component: () => import('@/views/PaymentPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my/tickets',
      name: 'my-tickets',
      component: () => import('@/views/MyTicketsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/events',
      name: 'admin-events',
      component: () => import('@/views/AdminEventsPage.vue'),
      meta: { requiresAuth: true, requiresOrganizer: true },
    },
    {
      path: '/admin/events/new',
      name: 'admin-event-create',
      component: () => import('@/views/AdminEventCreatePage.vue'),
      meta: { requiresAuth: true, requiresOrganizer: true },
    },
    {
      path: '/admin/events/:id',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardPage.vue'),
      meta: { requiresAuth: true, requiresOrganizer: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue'),
    },
  ],
})

// ORGANIZER가 접근하면 안 되는 소비자 전용 페이지
const consumerOnlyRoutes = new Set([
  'home', 'concert-detail', 'queue', 'lottery', 'seats',
  'payment', 'payment-result', 'my-tickets',
])

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('access_token')) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresOrganizer) {
    try {
      const raw = localStorage.getItem('user')
      const user = raw ? JSON.parse(raw) : null
      if (user?.role !== 'ORGANIZER') {
        return { name: 'home' }
      }
    } catch {
      return { name: 'home' }
    }
  }

  // ORGANIZER는 소비자 페이지 접근 불가 → 어드민으로 리다이렉트
  try {
    const raw = localStorage.getItem('user')
    const user = raw ? JSON.parse(raw) : null
    if (user?.role === 'ORGANIZER' && consumerOnlyRoutes.has(to.name as string)) {
      return { name: 'admin-events' }
    }
  } catch {
    // ignore
  }
})

export default router
