import { useAuthStore } from '@/stores/useAuthStore'
import { handleHttpError } from '@/utils/errorHandler'
import axios from 'axios'

const httpAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
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
    handleHttpError(error)
    return Promise.reject(error)
  },
)

export default httpAdmin
