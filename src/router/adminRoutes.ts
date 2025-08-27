import AdminLayout from "@/layouts/admin/AdminLayout.vue";

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            name: 'admin.categories',
            component: () => import('@/views/admin/Category/CategoryListView.vue'),
          },
          {
            path: 'create',
            name: 'admin.categories.create',
            component: () => import('@/views/admin/Category/CategoryCreateView.vue'),
          },
          {
            path: 'edit/:id',
            name: 'admin.categories.edit',
            component: () => import('@/views/admin/Category/CategoryEditView.vue'),
          },
        ],
      },
    ],
  },
]

export default adminRoutes
