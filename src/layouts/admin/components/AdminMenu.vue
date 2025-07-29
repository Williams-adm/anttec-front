<script setup lang="ts">
import { useUIStore } from '@/stores/useUIStore';
import type { adminMenuInterface } from '../interface/adminMenuInterface';

const ui = useUIStore()
const toggleMenu = ui.toggleMenu

const links: adminMenuInterface[] = [
  {
    'name': 'Tienda virtual',
    'route': 'home'
  },
  {
    'name': 'Cerrar sesión',
    'route': 'home'
  }
]
</script>

<template>
  <div class="flex items-center">
    <div class="flex items-center ms-3">
      <div>
        <button
          type="button"
          class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          @click="toggleMenu()"
          aria-expanded="false"
        >
          <span class="sr-only">Open user menu</span>
          <img
            class="w-8 h-8 rounded-full"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="user photo"
          />
        </button>
      </div>
      <div
        class="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600"
        :class="
          ui.isMenuOpen
            ? 'block absolute -top-4 right-23 m-0 translate-x-[80px] translate-y-[58px]'
            : 'hidden' ">
        <div class="px-4 py-3" role="none">
          <p class="text-sm text-gray-900 dark:text-white" role="none">Elmo Sims</p>
        </div>
        <ul class="py-1" role="none">
          <li v-for="link in links" :key="link.name">
            <router-link :to="{ name: link.route}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
              {{ link.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
