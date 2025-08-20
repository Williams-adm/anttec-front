import AdminLayout from "@/layouts/admin/AdminLayout.vue";

const DashboardView = () => import('@/views/admin/DashboardView.vue')
const CategoryList = () => import('@/views/admin/Category/CategoryViewList.vue')
const CategoryCreate = () => import('@/views/admin/Category/CategoryViewCreate.vue')

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: DashboardView,
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            name: 'admin.categories',
            component: CategoryList
          },
          {
            path: 'create',
            name: 'admin.categories.create',
            component: CategoryCreate
          }
        ]
      },
    ],
  },
]

export default adminRoutes
