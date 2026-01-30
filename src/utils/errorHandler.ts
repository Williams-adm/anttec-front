// src/utils/errorHandler.ts

import router, { lastValidRoute } from '@/router'
import { useAuthStore } from '@/stores/useAuthStore'
import type { AxiosError } from 'axios'

interface ErrorHandlerOptions {
  isPublicEndpoint?: boolean
  redirect404?: boolean // Si debe redirigir en 404
}

export function handleHttpError(error: AxiosError, options: ErrorHandlerOptions = {}) {
  const {
    isPublicEndpoint = false,
    redirect404 = true, // Por defecto SÍ redirige
  } = options

  const status = error.response?.status

  switch (status) {
    case 401: {
      // Si es endpoint público, no hacer nada (usuario no autenticado)
      if (isPublicEndpoint) {
        console.warn('Unauthorized request on public endpoint:', error.config?.url)
        return
      }

      // Si es endpoint protegido, significa sesión expirada
      const authStore = useAuthStore()
      if (authStore.isAuthenticated()) {
        authStore.clear()
        router.push({ name: 'session-expired' })
      } else {
        // Usuario ya estaba deslogueado, ir a login
        router.push({ name: 'login' })
      }
      break
    }

    case 403:
      console.warn('Forbidden access:', error.config?.url)
      router.push({ name: 'unauthorized' })
      break

    case 404:
      console.warn('Resource not found:', error.config?.url)
      if (redirect404) {
        router.push({ name: 'not-found' })
      }
      break

    case 500:
    case 502:
      console.error('Server error:', status, error.config?.url)
      router.push({
        name: 'server-error',
        query: { from: lastValidRoute }, // ← Usar la última ruta válida guardada
      })
      break

    case 503:
      console.warn('Service unavailable:', error.config?.url)
      router.push({
        name: 'server-error',
        query: { from: lastValidRoute }, // ← Usar la última ruta válida guardada
      })
      break

    default:
      console.error('Unhandled HTTP error:', status, error)
  }
}
