<script setup lang="ts">
import { useAddress } from '@/composables/useaddress';
import type { addressCheckoutCreateDTO } from '@/DTOs/shop/address/AddressCheckoutCreateDTO';
import type { addressSI } from '@/interfaces/shop/AddressSInterface';
import { ref, watch, onMounted, computed } from 'vue'

interface Props {
  isOpen: boolean
  editAddress?: addressSI | null
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  editAddress: null,
})

const emit = defineEmits<{
  close: []
  saved: [address: addressSI]
}>()

const {
  departments,
  provinces,
  districts,
  isLoadingLocations,
  loadDepartments,
  loadProvinces,
  loadDistricts,
  clearProvinces,
  clearDistricts,
  createAddress,
  updateAddress,
} = useAddress()

const isSubmitting = ref(false)
const selectedDepartment = ref<number>(0)
const selectedProvince = ref<number>(0)

const formData = ref<addressCheckoutCreateDTO>({
  street: '',
  street_number: '',
  reference: '',
  district_id: 0,
})

const isEditMode = computed(() => props.editAddress !== null)

// Cargar departamentos al montar
onMounted(async () => {
  await loadDepartments()
})

// Si es modo edición, pre-cargar datos
watch(() => props.editAddress, (address) => {
  if (address) {
    formData.value = {
      street: address.street.split(' ')[0] || '', // Extraer calle del string
      street_number: address.street.split(' ').slice(1).join(' ') || '',
      reference: address.reference,
      district_id: 0, // Necesitarías el ID del distrito
    }
  }
}, { immediate: true })

// Watch para cargar provincias cuando cambia departamento
watch(selectedDepartment, async (newId) => {
  if (newId) {
    selectedProvince.value = 0
    formData.value.district_id = 0
    clearDistricts()
    await loadProvinces(newId)
  } else {
    clearProvinces()
  }
})

// Watch para cargar distritos cuando cambia provincia
watch(selectedProvince, async (newId) => {
  if (newId) {
    formData.value.district_id = 0
    await loadDistricts(newId)
  } else {
    clearDistricts()
  }
})

// Obtener precio de envío del distrito seleccionado
const selectedDistrictPrice = computed(() => {
  const district = districts.value.find((d) => d.id === formData.value.district_id)
  return district ? 0 : 0 // En tu caso, el precio viene del backend después de crear
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    let savedAddress: addressSI

    if (isEditMode.value && props.editAddress) {
      // Modo edición
      savedAddress = await updateAddress(props.editAddress.id, formData.value)
    } else {
      // Modo creación
      savedAddress = await createAddress(formData.value)
    }

    emit('saved', savedAddress)
    handleClose()
  } catch (error) {
    console.error('Error al guardar dirección:', error)
    alert('Error al guardar la dirección. Por favor intenta nuevamente.')
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  // Resetear formulario
  formData.value = {
    street: '',
    street_number: '',
    reference: '',
    district_id: 0,
  }
  selectedDepartment.value = 0
  selectedProvince.value = 0
  emit('close')
}

const isFormValid = computed(() => {
  return (
    formData.value.street.trim() !== '' &&
    formData.value.street_number.trim() !== '' &&
    formData.value.district_id > 0
  )
})
</script>

<template>
  <!-- Modal Overlay -->
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <!-- Modal Content -->
      <transition
        enter-active-class="transition-all duration-300"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="isOpen"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <!-- Header -->
          <div class="sticky top-0 z-10 bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
              <font-awesome-icon icon="fa-solid fa-location-dot" />
              {{ isEditMode ? 'Editar dirección' : 'Nueva dirección' }}
            </h2>
            <button
              @click="handleClose"
              class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white"
            >
              <font-awesome-icon icon="fa-solid fa-times" />
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <!-- Departamento -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Departamento *
              </label>
              <select
                v-model="selectedDepartment"
                required
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
                :disabled="isLoadingLocations"
              >
                <option :value="0" disabled>Seleccione un departamento</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Provincia -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Provincia *
              </label>
              <select
                v-model="selectedProvince"
                required
                :disabled="!selectedDepartment || isLoadingLocations"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option :value="0" disabled>Seleccione una provincia</option>
                <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
                  {{ prov.name }}
                </option>
              </select>
            </div>

            <!-- Distrito -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Distrito *
              </label>
              <select
                v-model="formData.district_id"
                required
                :disabled="!selectedProvince || isLoadingLocations"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option :value="0" disabled>Seleccione un distrito</option>
                <option v-for="dist in districts" :key="dist.id" :value="dist.id">
                  {{ dist.name }}
                </option>
              </select>
            </div>

            <!-- Calle y Número en grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Calle -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Calle / Avenida *
                </label>
                <input
                  v-model="formData.street"
                  type="text"
                  required
                  placeholder="Ej: Av. José Pardo"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
                />
              </div>

              <!-- Número -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Número *
                </label>
                <input
                  v-model="formData.street_number"
                  type="text"
                  required
                  placeholder="Ej: 123"
                  class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <!-- Referencia -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Referencia (opcional)
              </label>
              <textarea
                v-model="formData.reference"
                rows="3"
                placeholder="Ej: Casa blanca con puerta verde, cerca al parque"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100 resize-none"
              ></textarea>
            </div>

            <!-- Info del precio (si está disponible) -->
            <div
              v-if="formData.district_id > 0"
              class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
            >
              <div class="flex items-center gap-3">
                <font-awesome-icon icon="fa-solid fa-info-circle" class="text-blue-600 dark:text-blue-400" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
                    El costo de envío se calculará al guardar la dirección
                  </p>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="!isFormValid || isSubmitting || isLoadingLocations"
                class="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <font-awesome-icon icon="fa-solid fa-spinner" spin />
                  Guardando...
                </span>
                <span v-else>
                  {{ isEditMode ? 'Guardar cambios' : 'Agregar dirección' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </transition>
</template>
