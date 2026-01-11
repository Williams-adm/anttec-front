import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from './publicRoutes'
import adminRoutes from './adminRoutes'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [...publicRoutes, ...adminRoutes]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // ← Aquí agregamos scrollBehavior
  scrollBehavior(to, from, savedPosition) {
    // Si hay posición guardada (volver atrás con el botón de navegador)
    if (savedPosition) {
      return savedPosition
    }
    // Si hay un hash (ej. #terminos)
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', // scroll suave
      }
    }
    // Por defecto, ir al top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    return next({ name: 'login' })
  }

  if (to.name === 'login' && authStore.isAuthenticated()) {
    return next({ name: 'admin.dashboard' })
  }

  next()
})
export default router
