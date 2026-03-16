import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('@/views/EventListView.vue'),
  },
  {
    path: '/events/:id',
    name: 'event-detail',
    component: () => import('@/views/EventDetailView.vue'),
    props: true,
  },
  {
    path: '/reservation/:eventId',
    name: 'reservation',
    component: () => import('@/views/ReservationView.vue'),
    props: true,
  },
  {
    path: '/my-page',
    name: 'my-page',
    component: () => import('@/views/MyPageView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
