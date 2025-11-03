import AdminLayout from '@/layouts/admin/AdminLayout.vue'

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
      {
        path: 'subcategories',
        children: [
          {
            path: '',
            name: 'admin.subcategories',
            component: () => import('@/views/admin/Subcategory/SubcategoryListView.vue'),
          },
          {
            path: 'create',
            name: 'admin.subcategories.create',
            component: () => import('@/views/admin/Subcategory/SubcategoryCreateView.vue'),
          },
          {
            path: 'edit/:id',
            name: 'admin.subcategories.edit',
            component: () => import('@/views/admin/Subcategory/SubcategoryEditView.vue'),
          },
        ],
      },
      {
        path: 'brands',
        children: [
          {
            path: '',
            name: 'admin.brands',
            component: () => import('@/views/admin/Brands/BrandListView.vue'),
          },
          {
            path: 'create',
            name: 'admin.brands.create',
            component: () => import('@/views/admin/Brands/BrandCreateView.vue'),
          },
          {
            path: 'edit/:id',
            name: 'admin.brands.edit',
            component: () => import('@/views/admin/Brands/BrandEditView.vue'),
          },
        ],
      },
    ],
  },
]

export default adminRoutes
