import { useAuthStore } from "@/stores/useAuthStore"
import { handleApiError } from "@/utils/handleApiError"
import axios from "axios"

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
    const status = error.response?.status

    // 🔐 Autenticación expirada
    // Solo manejamos el error normalmente
    if (status === 401) {
      // No hacemos logout automático en httpPublic
      // porque puede ser un guest intentando acceder a algo protegido
      window.location.href = '/login'
      console.warn('Unauthorized request:', error.config.url)
    }

    handleApiError(error)
    return Promise.reject(error)
  },
)

export default httpPublic
