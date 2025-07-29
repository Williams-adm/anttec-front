<script setup lang="ts">
import { useUIStore } from '@/stores/useUIStore';
import type { adminAsideInterface } from '../interface/adminAsideInterface';
import { useRoute } from 'vue-router';

const ui = useUIStore()
const links: adminAsideInterface[] = [
  {
    'name': 'Dashboard',
    'icon': 'fa-solid fa-chart-line',
    'route': 'admin.dashboard'
  },
  {
    'name': 'Categorias',
    'icon': 'fa-solid fa-layer-group',
    'route': 'admin.categories'
  },
]

const route = useRoute();
const isActive = (routeName: string) => route.name === routeName;
</script>

<template>
  <aside class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform  bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
    :class="{ '-translate-x-full': !ui.isSidebarOpen }" aria-label="Sidebar">
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <li v-for="link in links" :key="link.name">
            <router-link :to="{ name: link.route }" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group" exactActiveClass="bg-gray-100 dark:bg-gray-700">
              <font-awesome-icon :icon="link.icon" size="xl" :class="['transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white',
                isActive(link.route) ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-400'
              ]"/>
              <span class="flex-1 ms-3 whitespace-nowrap">{{ link.name }}</span>
            </router-link>
          </li>
        </ul>
    </div>
  </aside>
</template>
