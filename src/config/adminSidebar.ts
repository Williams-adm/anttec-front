import type { adminAsideInterface } from '@/layouts/admin/interface/adminAsideInterface'

export const adminSidebarLinks: adminAsideInterface[] = [
  {
    name: 'Dashboard',
    icon: 'fa-solid fa-chart-line',
    route: 'admin.dashboard',
  },
  {
    name: 'Marcas',
    icon: 'fa-solid fa-tags',
    route: 'admin.brands',
  },
  {
    name: 'Categorías',
    icon: 'fa-solid fa-layer-group',
    route: 'admin.categories',
  },
  {
    name: 'Subcategorías',
    icon: 'fa-solid fa-list',
    route: 'admin.subcategories',
  },
  {
    name: 'Catálogo',
    icon: 'fa-solid fa-book',
    route: 'admin.catalog',
    children: [
      {
        name: 'Productos',
        icon: 'fa-solid fa-box',
        route: 'admin.catalog.products',
      },
      {
        name: 'Especificaciones',
        icon: 'fa-solid fa-list-check',
        route: 'admin.catalog.specifications',
      },
      {
        name: 'Opciones',
        icon: 'fa-solid fa-gear',
        route: 'admin.catalog.options',
      },
    ],
  },
  {
    name: 'Almacén',
    icon: 'fa-solid fa-shop',
    route: 'admin.store',
    children: [
      {
        name: 'Sucursal',
        icon: 'fa-solid fa-warehouse',
        route: 'admin.store.branches',
      },
      {
        name: 'Inventario',
        icon: 'fa-solid fa-clipboard-list',
        route: 'admin.store.variants',
      },
      {
        name: 'Movimientos',
        icon: 'fa-solid fa-file-invoice',
        route: 'admin.store.movements',
      },
    ],
  },
  {
    name: 'Portadas',
    icon: 'fa-solid fa-images',
    route: 'admin.covers',
  },
]
