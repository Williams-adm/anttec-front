import type { userI } from '@/services/auth/interface/UserInterface'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    user: null as userI | null,
  }),

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('access_token', token)
    },

    setUser(user: userI) {
      this.user = user
    },

    clearToken() {
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
    },

    isAuthenticated(): boolean {
      return !!this.token
    },
  },
})
