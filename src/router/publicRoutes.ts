import ShopLayout from '@/layouts/shop/ShopLayout.vue'
import LoginView from '@/views/auth/login/LoginView.vue'

const publicRoutes = [
  {
    path: '/',
    component: ShopLayout,
    children: [
      {
        path: '',
        name: 'shop.home',
        component: () => import('@/views/shop/HomeView.vue'),
      },
      {
        path: 'products',
        children: [
          {
            path: 'category/:categoryId',
            name: 'shop.products.category',
            component: () => import('@/views/shop/product/ProductsView.vue'),
          },
          {
            path: 'category/:categoryId/subcategory/:subcategoryId',
            name: 'shop.products.category.subcategory',
            component: () => import('@/views/shop/product/ProductsView.vue'),
          },

        ]
      },
      {
        path: 'variant/product/:productId/variant/:variantId',
        name: 'shop.variant.show',
        component: () => import('@/views/shop/variant/VariantShowView.vue'),
      },
      {
        path: 'cart',
        name: 'shop.cart',
        component: () => import('@/views/shop/cart/CartView.vue'),
      },
      {
        path: 'aboutUs',
        name: 'shop.aboutUs',
        component: () => import('@/views/shop/footer/company/AboutUsView.vue'),
      },
      {
        path: 'privacy-policy',
        name: 'shop.privacyPolicy',
        component: () => import('@/views/shop/footer/legal/PrivacyPolicyView.vue'),
      },
      {
        path: 'terms-and-conditions',
        name: 'shop.termsAndConditions',
        component: () => import('@/views/shop/footer/legal/TermsAndConditionsView.vue'),
      },
      {
        path: 'shipping-policy',
        name: 'shop.shippingPolicy',
        component: () => import('@/views/shop/footer/legal/ShippingPolicyView.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
]

export default publicRoutes
