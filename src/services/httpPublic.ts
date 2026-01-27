import { useAuthStore } from '@/stores/useAuthStore'
import { handleHttpError } from '@/utils/errorHandler'
import axios from 'axios'

const httpPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor de REQUEST
httpPublic.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    // 1. Si el usuario está autenticado, agregar el token
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

httpPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    handleHttpError(error)

    return Promise.reject(error)
  },
)

export default httpPublic
