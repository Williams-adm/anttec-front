import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from './publicRoutes'
import adminRoutes from './adminRoutes'

const routes = [
  ...publicRoutes,
  ...adminRoutes,
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
