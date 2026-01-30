<script setup lang="ts">
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/usecheckout';

const { summary, shippingCost } = useCheckout()
const { items } = useCart()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
      <h2 class="text-xl font-bold text-white flex items-center gap-2">
        Resumen de compra
      </h2>
    </div>

    <!-- Contenido -->
    <div class="p-6 space-y-4">
      <!-- Productos -->
      <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        <div
          v-for="item in items"
          :key="item.item_id"
          class="flex gap-3 p-3 bg-gray-50 dark:bg-gray-950 rounded-lg"
        >
          <div
            class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
          >
            <img
              v-if="item.variant.image"
              :src="item.variant.image"
              alt="imagen variante"
              class="w-full h-full object-cover"
            />
            <font-awesome-icon
              v-else
              icon="fa-solid fa-image"
              class="text-gray-400 text-2xl"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ item.variant.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Cantidad: {{ item.quantity }}
            </p>
            <p class="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
              S/ {{ (item.unit_price * item.quantity) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 dark:border-gray-500 my-4"></div>

      <!-- Desglose de precios -->
      <div class="space-y-3">
        <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
          <span>Subtotal ({{ summary.items_count }} {{ summary.items_count === 1 ? 'producto' : 'productos' }})</span>
          <span class="font-medium">S/ {{ summary.subtotal }}</span>
        </div>

        <div class="flex justify-between items-center text-gray-700 dark:text-gray-300">
          <span class="flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-truck-fast" class="text-sm" />
            Envío
          </span>
          <span
            class="font-medium"
            :class="shippingCost === 0 ? 'text-green-600 dark:text-green-400' : ''"
          >
            {{ shippingCost === 0 ? 'GRATIS' : `S/ ${shippingCost}` }}
          </span>
        </div>

        <!-- Descuentos (si aplica) -->
        <div
          v-if="summary.discount > 0"
          class="flex justify-between items-center text-green-600 dark:text-green-400"
        >
          <span class="flex items-center gap-2">
            <font-awesome-icon icon="fa-solid fa-tag" class="text-sm" />
            Descuentos
          </span>
          <span class="font-medium">- S/ {{ summary.discount }}</span>
        </div>
      </div>

      <!-- Total -->
      <div class="border-t-2 border-gray-300 dark:border-gray-600 pt-4 mt-4">
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
          <div class="text-right">
            <div class="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              S/ {{ summary.total }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Incluye IGV
            </div>
          </div>
        </div>
      </div>

      <!-- Info adicional -->
      <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
        <div class="flex items-start gap-2 text-green-700 dark:text-green-300 text-sm">
          <font-awesome-icon icon="fa-solid fa-shield" class="mt-0.5 shrink-0" />
          <div>
            <p class="font-medium">Compra protegida</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1">
              Tus datos están seguros y protegidos
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.8);
}
</style>
