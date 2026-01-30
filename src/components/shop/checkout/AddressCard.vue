<script setup lang="ts">
import type { addressSI } from '@/interfaces/shop/AddressSInterface';

interface Props {
  address: addressSI
  selected?: boolean
  selectable?: boolean
}

withDefaults(defineProps<Props>(), {
  selected: false,
  selectable: true,
})

const emit = defineEmits<{
  select: [address: addressSI]
  edit: [address: addressSI]
  delete: [address: addressSI]
  setFavorite: [address: addressSI]
}>()
</script>

<template>
  <div
    class="relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 overflow-hidden group"
    :class="[
      selected
        ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 ring-2 ring-blue-100 dark:ring-blue-900'
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md',
      selectable && 'cursor-pointer'
    ]"
    @click="selectable && emit('select', address)"
  >
    <!-- Badge de favorita -->
    <div
      v-if="address.favorite"
      class="absolute top-0 right-0 z-10 bg-linear-to-r from-yellow-400 to-amber-500 text-gray-800 font-semibold px-3 py-1 rounded-bl-xl shadow-lg flex items-center gap-1"
    >
      <font-awesome-icon icon="fa-solid fa-star" size="lg" />
      <span>Favorita</span>
    </div>

    <!-- Indicador de seleccionada -->
    <div
      v-if="selected"
      class="absolute top-3 left-3 z-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
    >
      <font-awesome-icon icon="fa-solid fa-circle-check" class="text-white" />
    </div>

    <!-- Contenido principal -->
    <div class="p-5">
      <!-- Dirección -->
      <div class="mb-4" :class="{ 'mt-2': selected || address.favorite }">
        <div class="flex items-start gap-3">
          <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
            <font-awesome-icon
              icon="fa-solid fa-location-dot"
              class="text-blue-600 dark:text-blue-400 text-2xl"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
              {{ address.street }} - <span>{{ address.district }}, {{ address.department }}</span>
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span>Referencia:</span> {{ address.reference }}
            </p>
          </div>
        </div>
      </div>

      <!-- Precio de envío -->
      <div class="flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-center gap-2">
          <font-awesome-icon
            icon="fa-solid fa-truck-fast"
            class="text-blue-600 dark:text-blue-400"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Costo de envío
          </span>
        </div>
        <span
          class="text-base font-bold"
          :class="address.delivery_price === 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'"
        >
          {{ address.delivery_price === 0 ? 'GRATIS' : `S/ ${address.delivery_price}` }}
        </span>
      </div>
    </div>

    <!-- Acciones (al hacer hover) -->
    <div
      v-if="!selectable"
      class="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <div class="flex items-center gap-2">
        <button
          v-if="!address.favorite"
          @click.stop="emit('setFavorite', address)"
          class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors py-2 px-3 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
        >
          <font-awesome-icon icon="fa-regular fa-star" class="mr-2" />
          Favorita
        </button>

        <button
          @click.stop="emit('edit', address)"
          class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <font-awesome-icon icon="fa-solid fa-pen" class="mr-2" />
          Editar
        </button>

        <button
          @click.stop="emit('delete', address)"
          class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <font-awesome-icon icon="fa-solid fa-trash" class="mr-2" />
          Eliminar
        </button>
      </div>
    </div>

    <!-- Overlay de selección -->
    <div
      v-if="selected"
      class="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/5 pointer-events-none"
    ></div>
  </div>
</template>
