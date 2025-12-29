<script setup lang="ts">
import noImg from '@/assets/img/no-image.jpg'
import BadgeStatus from '@/components/Admin/BadgeStatus.vue'
import ButtonCreate from '@/components/Admin/ButtonCreate.vue'
import InfoAlert from '@/components/Admin/InfoAlert.vue'
import AnimationLoader from '@/components/AnimationLoader.vue'
import { useBreadcrumb } from '@/composables/useBreadcrumb'
import { useSweetAlert } from '@/composables/useSweetAlert'
import type { variantShortsI } from '@/interfaces/admin/variant/variantShortInterface'
import ProductService from '@/services/admin/ProductService'
import VariantService from '@/services/admin/VariantService'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

useBreadcrumb([
  { name: 'Dashboard', route: 'admin.dashboard' },
  { name: 'Productos', route: 'admin.catalog.products' },
  { name: 'Detalle', route: 'admin.catalog.products.show' },
  { name: 'Variantes' },
])

const route = useRoute()
const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

const hasOptions = ref<string | null>(null)
const variants = ref<variantShortsI | null>(null)
const variantsList = computed(() => variants.value?.data ?? [])
const error = ref<string | null>(null)
const isLoading = ref(true)
const loadedImages = ref<Record<number, boolean>>({})

const loadData = async () => {
  try {
    ;[variants.value, hasOptions.value] = await Promise.all([
      VariantService.getAllShort(id),
      ProductService.hasOptions(id),
    ])
  } catch (err) {
    useSweetAlert({ title: 'Algo salió mal', text: 'Intenta de nuevo', icon: 'error', timer: 0 })
    error.value = 'No se pudieron cargar las optiones relacionadas.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <AnimationLoader v-if="isLoading" />
  <div v-else>
    <div v-if="hasOptions === 'Tiene opciones'">
      <div class="flex justify-end">
        <ButtonCreate route="admin.catalog.products.show.variants.create" />
      </div>
      <div v-if="variantsList.length > 0" class="space-y-3">
        <section
          v-for="(variant, index) in variantsList"
          :key="index"
          class="block border rounded-lg shadow-sm bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-3">
            <div class="py-2 flex items-center gap-4 justify-between">
              <div class="flex items-center gap-4">
                <div class="relative w-20 h-20">
                  <!-- Skeleton -->
                  <div
                    v-if="!loadedImages[index]"
                    role="status"
                    class="absolute inset-0 flex items-center justify-center bg-neutral-quaternary rounded animate-pulse"
                  >
                    <img
                      :src="noImg"
                      alt="Cargando imagen"
                      class="w-10 h-10 object-contain opacity-60"
                    />
                    <span class="sr-only">Loading...</span>
                  </div>

                  <!-- Imagen -->
                  <img
                    :src="variant.img[0].url ?? noImg"
                    alt="Imagen de la variante"
                    class="w-20 h-20 object-cover rounded"
                    @load="loadedImages[index] = true"
                    @error="loadedImages[index] = true"
                  />
                </div>
                <div class="px-2">
                  <p class="text-gray-500 dark:text-gray-400">SKU: {{ variant.sku }}</p>
                  <p class="font-medium text-gray-800 dark:text-gray-100 mt-2">
                    {{ variant.features.map((f) => f.description).join(' | ') }}
                  </p>
                </div>
              </div>

              <!-- El badge queda al final y a la derecha -->
              <BadgeStatus :status="variant.status" />
            </div>
          </div>
        </section>
      </div>
      <InfoAlert v-else message="Este producto aun no tiene variantes" />
    </div>
    <InfoAlert v-else message="Asigne opciones a este producto, para poder generar las variantes" />
  </div>
</template>
