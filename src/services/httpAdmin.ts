import { useAuthStore } from '@/stores/useAuthStore'
import { handleApiError } from '@/utils/handleApiError'
import axios from 'axios'

const httpAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  /* withCredentials: true, */
})

httpAdmin.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

httpAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // 🔐 Autenticación expirada
    if (status === 401) {
      /* const authStore = useAuthStore()
      authStore.logout() */
      window.location.href = '/login'
    } else {
      handleApiError(error)
    }

    return Promise.reject(error)
  },
)

export default httpAdmin
