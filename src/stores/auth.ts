import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<Record<string, unknown> | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('access_token', newToken)
  }

  function clearToken() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
  }

  function setUser(userData: Record<string, unknown>) {
    user.value = userData
  }

  function logout() {
    clearToken()
    const router = useRouter()
    router.push({ name: 'login' })
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    clearToken,
    setUser,
    logout,
  }
})
