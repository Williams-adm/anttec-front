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
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'aboutUs',
        name: 'shop.aboutUs',
        component: () => import('@/views/shop/footer/company/aboutUsView.vue'),
      },
      {
        path: 'privacy-policy',
        name: 'shop.privacyPolicy',
        component: () => import('@/views/shop/footer/legal/privacyPolicyView.vue'),
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
