import type { userI } from '@/interfaces/auth/UserInterface'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    user: localStorage.getItem('user')
      ? (JSON.parse(localStorage.getItem('user') as string) as userI)
      : null,
  }),

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('access_token', token)
    },

    setUser(user: userI) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    clear() {
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },

    isAuthenticated(): boolean {
      return !!this.token
    },
  },
})
