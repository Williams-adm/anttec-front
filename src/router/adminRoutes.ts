import AdminLayout from "@/layouts/admin/AdminLayout.vue";
const DashboardView = () => import('@/views/admin/DashboardView.vue')
const CategoryView = () => import('@/views/admin/CategoryView.vue')

const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: DashboardView,
      },
      {
        path: '/categories',
        name: 'admin.categories',
        component: CategoryView,
      },
    ],
  },
]

export default adminRoutes
