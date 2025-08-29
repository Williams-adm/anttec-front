<script setup lang="ts">
import { useBreadcrumb } from '@/composables/useBreadcrumb';

useBreadcrumb([
  { name: 'Dashboard' }
]);
</script>

<template>
  <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-900 dark:text-white">
    <div class="rounded-lg shadow-lg p-6 bg-gray-50 dark:bg-gray-800">
      <div class="flex items-center">
        <div class="ml-4 flex-1">
          <h2 class="text-lg font-semibold">Bienvenido</h2>
          <button class="text-sm">Cerrar sesión</button>
        </div>
      </div>
    </div>
    <div
      class="rounded-lg shadow-lg p-6 bg-gray-50 dark:bg-gray-800 flex items-center justify-center"
    >
      <h2 class="text-xl font-semibold">Anttec</h2>
    </div>
  </section>
</template>
