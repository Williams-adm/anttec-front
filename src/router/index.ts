import { useAuthStore } from '@/stores/useAuthStore'
import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './adminRoutes'
import publicRoutes from './publicRoutes'

const routes = [
  ...publicRoutes,
  ...adminRoutes,
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/errors/UnauthorizedView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/session-expired',
    name: 'session-expired',
    component: () => import('@/views/errors/SessionExpiredView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/server-error',
    name: 'server-error',
    component: () => import('@/views/errors/ServerErrorView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: () => import('@/views/errors/MaintenanceView.vue'),
    meta: { requiresAuth: false },
  },
  // ✅ Catch-all 404 - DEBE IR AL FINAL
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFoundView.vue'),
    meta: { requiresAuth: false },
  },
]

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

  // 2. Si ya está logueado y va a login, redirigir según rol
  if (to.name === 'login' && authStore.isAuthenticated()) {
    if (authStore.isAdmin) {
      return next({ name: 'admin.dashboard' })
    } else {
      return next({ name: 'shop.home' })
    }
  }

  // 3. Verificar roles requeridos
  if (to.meta.roles) {
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles]
    const hasRequiredRole = requiredRoles.some((role) => authStore.hasRole(role))

    if (!hasRequiredRole) {
      return next({ name: 'unauthorized' })
    }
  }

  next()
})

router.onError((error) => {
  console.error('Router error:', error)
  router.push({ name: 'server-error' })
})

export default router
