<script setup lang="ts">
import { ref } from 'vue'
import { useClickOutside } from '@/composables/useClickOutside'

const profileRef = ref<HTMLElement | null>(null)
const isProfileOpen = ref(false)

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

useClickOutside(
  profileRef,
  () => {
    isProfileOpen.value = false
  },
  isProfileOpen,
)
</script>

<template>
  <div class="relative" ref="profileRef">
    <button
      class="flex items-center space-x-1 hover:underline cursor-pointer"
      @click="toggleProfile"
    >
      <!-- Desktop (md+) -->
      <div class="hidden md:inline">
        <span>Hola, Inicia Sesión</span>
        <font-awesome-icon icon="fa-solid fa-angle-down" />
      </div>

      <!-- Mobile -->
      <div class="block md:hidden">
        <font-awesome-icon icon="fa-solid fa-user" class="text-3xl text-gray-200" />
      </div>
    </button>
    <div
      v-if="isProfileOpen"
      class="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
    >
      <ul class="py-3 text-sm text-gray-700 dark:text-gray-200">
        <li>
          <router-link
            :to="{ name: 'login' }"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Iniciar sesión
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: '' }"
            class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Crear cuenta
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
