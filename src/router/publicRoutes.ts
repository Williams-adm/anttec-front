import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/auth/login/LoginView.vue";

const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
];

export default publicRoutes;
