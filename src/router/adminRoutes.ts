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
            component: () => import('@/views/admin/Brand/BrandListView.vue'),
          },
          {
            path: 'create',
            name: 'admin.brands.create',
            component: () => import('@/views/admin/Brand/BrandCreateView.vue'),
          },
          {
            path: 'edit/:id',
            name: 'admin.brands.edit',
            component: () => import('@/views/admin/Brand/BrandEditView.vue'),
          },
        ],
      },
      {
        path: 'catalog',
        children: [
          {
            path: 'products',
            children: [
              {
                path: '',
                name: 'admin.catalog.products',
                component: () => import('@/views/admin/Catalog/Product/ProductListView.vue'),
              },
              {
                path: 'create',
                name: 'admin.catalog.products.create',
                component: () => import('@/views/admin/Catalog/Product/ProductCreateView.vue'),
              },
              {
                path: 'show/:id',
                name: 'admin.catalog.products.show',
                component: () => import('@/views/admin/Catalog/Product/ProductShowView.vue'),
              },
              {
                path: 'show/:id/options',
                name: 'admin.catalog.products.show.options',
                component: () =>
                  import('@/views/admin/Catalog/Product/ProductOption/associateOptions.vue'),
              },
              {
                path: 'show/:id/variants',
                name: 'admin.catalog.products.show.variants',
                component: () =>
                  import('@/views/admin/Catalog/Product/Variant/productVariantView.vue'),
              },
              {
                path: 'show/:id/variants/create',
                name: 'admin.catalog.products.show.variants.create',
                component: () =>
                  import('@/views/admin/Catalog/Product/Variant/productVariantCreate.vue'),
              },
              {
                path: 'edit/:id',
                name: 'admin.catalog.products.edit',
                component: () => import('@/views/admin/Catalog/Product/ProductEditView.vue'),
              },
            ],
          },
          {
            path: 'specifications',
            children: [
              {
                path: '',
                name: 'admin.catalog.specifications',
                component: () =>
                  import('@/views/admin/Catalog/Specification/SpecificationListView.vue'),
              },
              {
                path: 'create',
                name: 'admin.catalog.specifications.create',
                component: () =>
                  import('@/views/admin/Catalog/Specification/SpecificationCreateView.vue'),
              },
              {
                path: 'edit/:id',
                name: 'admin.catalog.specifications.edit',
                component: () =>
                  import('@/views/admin/Catalog/Specification/SpecificationEditView.vue'),
              },
            ],
          },
          {
            path: 'options',
            children: [
              {
                path: '',
                name: 'admin.catalog.options',
                component: () => import('@/views/admin/Catalog/Options/OptionListView.vue'),
              },
              {
                path: 'show/:id',
                name: 'admin.catalog.options.show',
                component: () => import('@/views/admin/Catalog/Options/OptionShowView.vue'),
              },
              {
                path: 'create',
                name: 'admin.catalog.options.create',
                component: () => import('@/views/admin/Catalog/Options/OptionCreateView.vue'),
              },
              {
                path: 'edit/:id',
                name: 'admin.catalog.options.edit',
                component: () => import('@/views/admin/Catalog/Options/OptionEditView.vue'),
              },
            ],
          },
        ],
      },
      {
        path: 'store',
        children: [
          {
            path: 'branches',
            children: [
              {
                path: '',
                name: 'admin.store.branches',
                component: () => import('@/views/admin/store/branch/BranchListView.vue'),
              },
            ],
          },
          {
            path: 'variants',
            children: [
              {
                path: '',
                name: 'admin.store.variants',
                component: () => import('@/views/admin/store/variant/VariantListView.vue'),
              },
              {
                path: 'show/:id',
                name: 'admin.store.variants.show',
                component: () => import('@/views/admin/store/variant/VariantShowView.vue'),
              },
            ],
          },
          {
            path: 'movements',
            children: [
              {
                path: '',
                name: 'admin.store.movements',
                component: () => import('@/views/admin/store/movements/MovementsListView.vue'),
              },
              {
                path: 'create',
                name: 'admin.store.movements.create',
                component: () => import('@/views/admin/store/movements/MovementCreateView.vue'),
              },
              {
                path: 'show/:id',
                name: 'admin.store.movements.show',
                component: () => import('@/views/admin/store/movements/MovementShowView.vue'),
              },
            ],
          },
        ],
      },
      {
        path: 'covers',
        children: [
          {
            path: '',
            name: 'admin.covers',
            component: () => import('@/views/admin/Cover/CoverListView.vue'),
          },
          {
            path: 'create',
            name: 'admin.covers.create',
            component: () => import('@/views/admin/Cover/CoverCreateView.vue'),
          },
          {
            path: 'edit/:id',
            name: 'admin.covers.edit',
            component: () => import('@/views/admin/Cover/CoverEditView.vue'),
          },
        ],
      },
    ],
  },
]

export default adminRoutes
