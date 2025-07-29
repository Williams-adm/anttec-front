import AdminLayout from "@/layouts/admin/AdminLayout.vue";

const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    children: [

    ]
  },
]

export default adminRoutes
