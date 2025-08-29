<script setup lang="ts">
import CategoryService from '@/services/admin/CategoryService';
import type { categoriesI } from '@/services/admin/interfaces/CategoryInterface';
import { computed, onMounted, ref } from 'vue';
import InfoAlert from '@/components/Admin/InfoAlert.vue';
import AnimationLoader from '@/components/AnimationLoader.vue';
import { useBreadcrumb } from '@/composables/useBreadcrumb';
import ButtonCreate from '@/components/Admin/ButtonCreate.vue';
import ToggleSwitch from '@/components/Admin/ToggleSwitch.vue';
import { handleApiError } from '@/utils/handleApiError';
import { useSweetAlert } from '@/composables/useSweetAlert';
import Swal from 'sweetalert2';

useBreadcrumb([
  { name: 'Dashboard', route: 'admin.dashboard' },
  { name: 'Categorías' }
]);

const categories = ref<categoriesI | null>(null);
const error = ref<string | null>(null);
const categoriesList = computed(() => categories.value?.data ?? []);
const isLoading = ref(true);

const loadCategories = async () => {
  try {
    categories.value = await CategoryService.getAll();
  } catch (err) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 });
    error.value = 'No se pudieron cargar las categorías.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadCategories();
})

const updateStatus = async (id: number, currentStatus: boolean) => {
  try {
    const newStatus = !currentStatus;
    useSweetAlert({
      title: 'Enviando...',
      text: 'Actualizando estado',
      icon: 'loading'
    });
    await CategoryService.update({ status: newStatus }, String(id));

    const category = categoriesList.value.find((c) => c.id === id);
    if (category) {
      category.status = newStatus;
    }

    Swal.close();
  } catch (error) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 });
    handleApiError(error);
  }
}
</script>

<template>
  <AnimationLoader v-if="isLoading"/>
  <div v-else-if="categoriesList.length != 0">
    <div class="flex justify-end">
      <ButtonCreate route="admin.categories.create"/>
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">#</th>
            <th scope="col" class="px-6 py-3">Nombre</th>
            <th scope="col" class="px-6 py-3">Acciones</th>
            <th scope="col" class="px-6 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="['bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900',
            index != categoriesList.length - 1  ? 'border-b dark:border-gray-700 border-gray-200' : '']"
            v-for="(category, index) in categoriesList"
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
            <td class="px-6 py-4 text-right">
              <router-link :to="{ name: 'admin.categories.edit', params: { id: category.id   } }">
                <font-awesome-icon icon="fa-solid fa-pen-to-square" size="xl" class="text-amber-400"/>
              </router-link>
            </td>
            <td class="px-6 py-4">
              <ToggleSwitch :status="category.status" @update:status="() => updateStatus(category.id, category.status)"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <InfoAlert v-else message="Todavía no hay categorías registradas" />
</template>
