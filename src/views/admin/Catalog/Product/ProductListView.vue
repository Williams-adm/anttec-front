<script setup lang="ts">
import { useBreadcrumb } from '@/composables/useBreadcrumb';
import { useSweetAlert } from '@/composables/useSweetAlert';
import type { ProductsI } from '@/interfaces/admin/ProductInterface';
import ProductService from '@/services/admin/ProductService';
import { computed, onMounted, ref } from 'vue';
import InfoAlert from '@/components/Admin/InfoAlert.vue'
import AnimationLoader from '@/components/AnimationLoader.vue'
import ButtonCreate from '@/components/Admin/ButtonCreate.vue'
import ToggleSwitch from '@/components/Admin/ToggleSwitch.vue'
import Swal from 'sweetalert2'
import BadgeStatus from '@/components/Admin/BadgeStatus.vue'

useBreadcrumb([{ name: 'Dashboard', route: 'admin.dashboard' }, { name: 'Productos' }])

const products = ref<ProductsI | null>(null)
const error = ref<string | null>(null)
const productsList = computed(() => products.value?.data ?? [])
const isLoading = ref(true)

const loadProducts = async () => {
  try {
    products.value = await ProductService.getAll()
  } catch (err) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    error.value = 'No se pudieron cargar los productos.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProducts()
})

const updateStatus = async (id: number, currentStatus: boolean) => {
  try {
    const newStatus = !currentStatus
    useSweetAlert({
      title: 'Enviando...',
      text: 'Actualizando estado',
      icon: 'loading',
    })
    await CategoryService.update({ status: newStatus }, String(id))

    const category = categoriesList.value.find((c) => c.id === id)
    if (category) {
      category.status = newStatus
    }

    Swal.close()
  } catch (error) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    console.log(error)
  }
}
</script>

<template>
  <div class="flex justify-end">
    <ButtonCreate route="admin.catalog.products.create" />
  </div>
  <AnimationLoader v-if="isLoading" />
  <div v-else-if="productsList.length != 0">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3">#</th>
            <th scope="col" class="px-6 py-3">Nombre</th>
            <th scope="col" class="px-6 py-3">Modelo</th>
            <th scope="col" class="px-6 py-3">Subcategoría</th>
            <th scope="col" class="px-6 py-3">Marca</th>
            <th scope="col" class="px-6 py-3">Estado</th>
            <th scope="col" class="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :class="[
              'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900',
              index != productsList.length - 1
                ? 'border-b dark:border-gray-700 border-gray-200'
                : '',
            ]"
            v-for="(category, index) in productsList"
            :key="index"
          >
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ index + 1 }}
            </th>
            <td class="px-6 py-4">
              {{ category.name }}
            </td>
            <td class="px-6 py-4">
              {{ category.model }}
            </td>
            <td class="px-6 py-4">
              {{ category.subcategory }}
            </td>
            <td class="px-6 py-4">
              {{ category.brand }}
            </td>
            <td>
              <BadgeStatus :status="category.status" />
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-around">
                <router-link :to="{ name: 'admin.categories.edit', params: { id: category.id } }">
                  <font-awesome-icon
                    icon="fa-solid fa-pen-to-square"
                    size="xl"
                    class="text-amber-400"
                  />
                </router-link>
                <ToggleSwitch
                  :status="category.status"
                  @update:status="() => updateStatus(category.id, category.status)"
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
