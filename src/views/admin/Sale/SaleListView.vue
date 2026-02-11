<script setup lang="ts">
import InfoAlert from '@/components/Admin/InfoAlert.vue'
import AnimationLoader from '@/components/AnimationLoader.vue'
import { useBreadcrumb } from '@/composables/useBreadcrumb';
import { useSweetAlert } from '@/composables/useSweetAlert';
import type { salesI } from '@/interfaces/admin/SaleInterface';
import SaleService from '@/services/admin/SaleService';
import { computed, onMounted, ref } from 'vue';

const saleService = new SaleService()

useBreadcrumb([{ name: 'Dashboard', route: 'admin.dashboard' }, { name: 'Ventas' }])

const sales = ref<salesI | null>(null)
const error = ref<string | null>(null)
const salesList = computed(() => sales.value?.data ?? [])
const isLoading = ref(true)

const loadSales = async () => {
  try {
    sales.value = await saleService.getAll()
  } catch (err) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    error.value = 'No se pudieron cargar las ventas.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadSales()
})

</script>

<template>
  <AnimationLoader v-if="isLoading" />
  <div v-else-if="salesList.length != 0">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">#</th>
            <th scope="col" class="px-6 py-3">Tipo de Voucher</th>
            <th scope="col" class="px-6 py-3">N° Orden</th>
            <th scope="col" class="px-6 py-3">Tipo de Venta</th>
            <th scope="col" class="px-6 py-3">Empleado</th>
            <th scope="col" class="px-6 py-3">Cliente</th>
            <th scope="col" class="px-6 py-3">Total</th>
            <th scope="col" class="px-6 py-3">Voucher</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="[
              'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900',
              index != salesList.length - 1
                ? 'border-b dark:border-gray-700 border-gray-200'
                : '',
            ]"
            v-for="(sale, index) in salesList"
            :key="index"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ index + 1 }}
            </th>
            <td class="px-6 py-4">
              {{ sale.type_voucher }}
            </td>
            <td class="px-6 py-4">
              {{ sale.order_number }}
            </td>
            <td class="px-6 py-4">
              {{ sale.type_sale }}
            </td>
            <td class="px-6 py-4">
              <div class="line-clamp-2 block truncate">
                {{ sale.employee }}
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="w-32 line-clamp-2 block">
                {{ sale.customer }}
              </div>
            </td>
            <td class="px-6 py-4">
              S/. {{ sale.total }}
            </td>
            <td class="px-6 py-4">
              <a :href="sale.path" target="__blank">
                <font-awesome-icon
                      icon="fa-solid fa-receipt"
                      size="xl"
                      class="text-green-400"
                    />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <InfoAlert v-else message="Todavía no hay ventas registradas" />
</template>
