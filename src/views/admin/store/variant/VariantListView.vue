<script setup lang="ts">
import noImg from '@/assets/img/no-image.jpg'
import BadgeStatus from '@/components/Admin/BadgeStatus.vue'
import InfoAlert from '@/components/Admin/InfoAlert.vue'
import ToggleSwitch from '@/components/Admin/ToggleSwitch.vue'
import AnimationLoader from '@/components/AnimationLoader.vue'
import { useBreadcrumb } from '@/composables/useBreadcrumb'
import { useSweetAlert } from '@/composables/useSweetAlert'
import type { variantsI } from '@/interfaces/admin/variant/variantInterface'
import VariantService from '@/services/admin/VariantService'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'

useBreadcrumb([{ name: 'Dashboard', route: 'admin.dashboard' }, { name: 'Inventario' }])

const variants = ref<variantsI | null>(null)
const error = ref<string | null>(null)
const variantsList = computed(() => variants.value?.data ?? [])
const isLoading = ref(true)
const loadedImages = ref<Record<number, boolean>>({})

const loadVariants = async () => {
  try {
    variants.value = await VariantService.getAll()
  } catch (err) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    error.value = 'No se pudieron cargar las variantes.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadVariants()
})

const updateStatus = async (id: number | string, currentStatus: boolean) => {
  try {
    const newStatus = !currentStatus
    useSweetAlert({
      title: 'Enviando...',
      text: 'Actualizando estado',
      icon: 'loading',
    })
    await VariantService.updateStatus({ status: newStatus }, String(id))

    const product = variantsList.value.find((c) => c.id === id)
    if (product) {
      product.status = newStatus
    }

    Swal.close()
  } catch (error) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    console.log(error)
  }
}
</script>

<template>
  <AnimationLoader v-if="isLoading" />
  <div v-else-if="variantsList.length != 0">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">#</th>
            <th scope="col" class="px-6 py-3">Producto</th>
            <th scope="col" class="px-6 py-3">Variante</th>
            <th scope="col" class="px-6 py-3">Precio</th>
            <th scope="col" class="px-6 py-3">Stock</th>
            <th scope="col" class="px-6 py-3">Estado</th>
            <th scope="col" class="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="[
              'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900',
              index != variantsList.length - 1
                ? 'border-b dark:border-gray-700 border-gray-200'
                : '',
            ]"
            v-for="(variant, index) in variantsList"
            :key="index"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ index + 1 }}
            </th>
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="relative w-14 h-14 shrink-0">
                  <!-- Skeleton -->
                  <div
                    v-if="!loadedImages[index]"
                    role="status"
                    class="absolute inset-0 flex items-center justify-center bg-neutral-quaternary rounded animate-pulse"
                  >
                    <img
                      :src="noImg"
                      alt="Cargando imagen"
                      class="w-6 h-6 object-contain opacity-60"
                    />
                    <span class="sr-only">Loading...</span>
                  </div>

                  <!-- Imagen -->
                  <img
                    :src="variant.img[0].url ?? noImg"
                    alt="Imagen de la variante"
                    class="w-14 h-14 object-cover rounded"
                    @load="loadedImages[index] = true"
                    @error="loadedImages[index] = true"
                  />
                </div>
                <div class="flex flex-col min-w-0 gap-1">
                  <p class="font-semibold text-gray-900 dark:text-white truncate">
                    {{ variant.product.name }} - {{ variant.product.model }}
                  </p>
                  <p class="text-xs text-gray-400 whitespace-nowrap">
                    {{ variant.sku }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <!-- Combinación (badges) -->
              <div class="mt-1 flex flex-wrap gap-2">
                <span
                  v-for="(item, index) in variant.features"
                  :key="index"
                  class="inline-flex text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded px-2 py-0.5 truncate max-w-full"
                >
                  {{ item.option }} : {{ item.description }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">S/. {{ variant.selling_price }}</td>
            <td class="px-6 py-4">
              {{ variant.branch_stock.stock }}
            </td>
            <td>
              <BadgeStatus :status="variant.status" />
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-around">
                <router-link
                  :to="{ name: 'admin.store.variants.show', params: { id: variant.id } }"
                >
                  <font-awesome-icon icon="fa-solid fa-eye" size="xl" class="text-green-400" />
                </router-link>
                <router-link
                  :to="{ name: 'admin.catalog.products.edit', params: { id: variant.id } }"
                >
                  <font-awesome-icon
                    icon="fa-solid fa-pen-to-square"
                    size="xl"
                    class="text-amber-400"
                  />
                </router-link>
                <ToggleSwitch
                  :status="variant.status"
                  @update:status="() => updateStatus(variant.id, variant.status)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <InfoAlert v-else message="Todavía no hay productos registrados" />
</template>
