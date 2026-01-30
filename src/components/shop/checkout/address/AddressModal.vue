<script setup lang="ts">
import { useAddress } from '@/composables/useaddress';
import type { addressCheckoutCreateDTO } from '@/DTOs/shop/address/AddressCheckoutCreateDTO';
import type { addressSI } from '@/interfaces/shop/AddressSInterface';
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Modal, type ModalInterface } from 'flowbite'
import { useForm } from 'vee-validate';
import { createCheckoutAddressSchema } from '@/schemas/shop/checkoutAddress/createCheckoutAddressSchema';
import { useSweetAlert } from '@/composables/useSweetAlert'
import axios from 'axios'
import Swal from 'sweetalert2'

interface Props {
  editAddress?: addressSI | null
}

const props = withDefaults(defineProps<Props>(), {
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
  createAddress,
  updateAddress,
} = useAddress()

// ✅ Flowbite Modal
const modalEl = ref<HTMLElement | null>(null)
let modal: ModalInterface | null = null

const isSubmitting = ref(false)
const isDepartmentsLoading = ref(false)
const isProvincesLoading = ref(false)
const serverErrors = ref<Record<string, string[]>>({})

// ✅ VeeValidate Setup
const { meta, handleSubmit, errors, defineField, setErrors, resetForm, resetField } = useForm({
  validationSchema: createCheckoutAddressSchema,
  initialValues: {
    department_id: '',
    province_id: '',
    district_id: '',
    street: '',
    street_number: '',
    reference: '',
  },
})

// ✅ Define Fields
const [departmentId, departmentIdAttrs] = defineField('department_id')
const [provinceId, provinceIdAttrs] = defineField('province_id')
const [districtId, districtIdAttrs] = defineField('district_id')
const [street, streetAttrs] = defineField('street')
const [streetNumber, streetNumberAttrs] = defineField('street_number')
const [reference, referenceAttrs] = defineField('reference')

// ✅ Inicializar modal de Flowbite
onMounted(async () => {
  await loadDepartments()

  if (!modalEl.value) return

  modal = new Modal(modalEl.value, {
    placement: 'center',
    backdrop: 'dynamic',
    closable: true,
  })
})

onUnmounted(() => {
  modal?.hide()
  modal = null
})

// ✅ Métodos públicos para abrir/cerrar
const open = () => {
  modal?.show()
}

const close = () => {
  modal?.hide()
  resetForm()
  emit('close')
}

// ✅ Watch para cargar provincias cuando cambia departamento
watch(departmentId, async (newDepartmentId) => {
  provinces.value = []
  districts.value = []
  resetField('province_id')
  resetField('district_id')

  if (!newDepartmentId) return

  try {
    isDepartmentsLoading.value = true
    await loadProvinces(Number(newDepartmentId))
  } catch (err) {
    useSweetAlert({
      title: 'Error',
      text: 'No se pudieron cargar las provincias',
      icon: 'error',
    })
    console.error(err)
  } finally {
    isDepartmentsLoading.value = false
  }
})

// ✅ Watch para cargar distritos cuando cambia provincia
watch(provinceId, async (newProvinceId) => {
  districts.value = []
  resetField('district_id')

  if (!newProvinceId) return

  try {
    isProvincesLoading.value = true
    await loadDistricts(Number(newProvinceId))
  } catch (err) {
    useSweetAlert({
      title: 'Error',
      text: 'No se pudieron cargar los distritos',
      icon: 'error',
    })
    console.error(err)
  } finally {
    isProvincesLoading.value = false
  }
})

// ✅ Si es modo edición, pre-cargar datos
watch(() => props.editAddress, (address) => {
  if (address && modal) {
    // Aquí necesitarías extraer los IDs de departamento, provincia del address
    // Asumiendo que tienes esa info en el objeto address
    resetForm({
      values: {
        department_id: '', // Necesitarías obtener esto del address
        province_id: '', // Necesitarías obtener esto del address
        district_id: String(address.district || ''),
        street: address.street.split(' ')[0] || '',
        street_number: address.street.split(' ').slice(1).join(' ') || '',
        reference: address.reference || '',
      }
    })
  }
}, { immediate: true })

// ✅ Submit Handler
const onSubmit = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true

    useSweetAlert({
      title: 'Enviando...',
      text: 'Guardando dirección',
      icon: 'loading',
    })

    // ✅ Payload solo con los datos que necesita el backend
    const payload: addressCheckoutCreateDTO = {
      district_id: Number(values.district_id),
      street: values.street,
      street_number: values.street_number,
      reference: values.reference || '',
    }

    let savedAddress: addressSI

    if (props.editAddress) {
      // Modo edición
      savedAddress = await updateAddress(props.editAddress.id, payload)
    } else {
      // Modo creación
      savedAddress = await createAddress(payload)
    }

    Swal.close()
    useSweetAlert({
      title: '¡Éxito!',
      text: props.editAddress ? 'Dirección actualizada correctamente' : 'Dirección creada correctamente',
      icon: 'success',
    })

    emit('saved', savedAddress)
    close()

  } catch (err) {
    Swal.close()

    // ✅ Manejo de errores de validación del servidor
    if (axios.isAxiosError(err) && err.response?.status === 422) {
      const validationErrors = err.response.data.errors
      serverErrors.value = validationErrors

      const veeValidateErrors: Record<string, string> = {}
      Object.keys(validationErrors).forEach((field) => {
        veeValidateErrors[field] = validationErrors[field][0]
      })

      setErrors(veeValidateErrors)
    }

    useSweetAlert({
      title: 'Error',
      text: 'No se pudo guardar la dirección. Verifica los datos e intenta de nuevo.',
      icon: 'error',
      timer: 0,
    })

    console.error('Error al guardar dirección:', err)
  } finally {
    isSubmitting.value = false
  }
})

// ✅ Exponer métodos para usar con ref
defineExpose({
  open,
  close
})
</script>

<template>
  <!-- ✅ Modal de Flowbite -->
  <div
    ref="modalEl"
    tabindex="-1"
    aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <div class="relative bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
        <!-- Header -->
        <div class="sticky top-0 z-10 bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <font-awesome-icon icon="fa-solid fa-location-dot" />
            {{ props.editAddress ? 'Editar dirección' : 'Nueva dirección' }}
          </h2>
          <button
            @click="close"
            type="button"
            class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white cursor-pointer"
          >
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>

        <!-- Form -->
        <form @submit="onSubmit" class="p-6 space-y-5 max-h-[calc(90vh-120px)] overflow-y-auto">
          <!-- Departamento -->
          <div>
            <label for="department_id" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Departamento *
            </label>
            <select
              v-model="departmentId"
              v-bind="departmentIdAttrs"
              id="department_id"
              :disabled="isLoadingLocations"
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option disabled value="">Seleccione un departamento</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <span v-if="errors.department_id" class="text-sm text-red-500 mt-1 block">
              {{ errors.department_id }}
            </span>
          </div>

          <!-- Provincia -->
          <div>
            <label for="province_id" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Provincia *
            </label>
            <select
              v-model="provinceId"
              v-bind="provinceIdAttrs"
              id="province_id"
              :disabled="!departmentId || isDepartmentsLoading || isLoadingLocations"
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option disabled value="">
                {{ isDepartmentsLoading ? 'Cargando...' : 'Seleccione una provincia' }}
              </option>
              <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
                {{ prov.name }}
              </option>
            </select>
            <span v-if="errors.province_id" class="text-sm text-red-500 mt-1 block">
              {{ errors.province_id }}
            </span>
          </div>

          <!-- Distrito -->
          <div>
            <label for="district_id" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Distrito *
            </label>
            <select
              v-model="districtId"
              v-bind="districtIdAttrs"
              id="district_id"
              :disabled="!provinceId || isProvincesLoading || isLoadingLocations"
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option disabled value="">
                {{ isProvincesLoading ? 'Cargando...' : 'Seleccione un distrito' }}
              </option>
              <option v-for="dist in districts" :key="dist.id" :value="dist.id">
                {{ dist.name }}
              </option>
            </select>
            <span v-if="errors.district_id" class="text-sm text-red-500 mt-1 block">
              {{ errors.district_id }}
            </span>
          </div>

          <!-- Calle y Número en grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Calle -->
            <div>
              <label for="street" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Calle / Avenida *
              </label>
              <input
                v-model="street"
                v-bind="streetAttrs"
                id="street"
                type="text"
                placeholder="Ej: Av. José Pardo"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
              />
              <span v-if="errors.street" class="text-sm text-red-500 mt-1 block">
                {{ errors.street }}
              </span>
            </div>

            <!-- Número -->
            <div>
              <label for="street_number" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Número *
              </label>
              <input
                v-model="streetNumber"
                v-bind="streetNumberAttrs"
                id="street_number"
                type="text"
                placeholder="Ej: 123"
                class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
              />
              <span v-if="errors.street_number" class="text-sm text-red-500 mt-1 block">
                {{ errors.street_number }}
              </span>
            </div>
          </div>

          <!-- Referencia -->
          <div>
            <label for="reference" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Referencia (opcional)
            </label>
            <textarea
              v-model="reference"
              v-bind="referenceAttrs"
              id="reference"
              rows="3"
              placeholder="Ej: Casa blanca con puerta verde, cerca al parque"
              class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100 resize-none"
            ></textarea>
            <span v-if="errors.reference" class="text-sm text-red-500 mt-1 block">
              {{ errors.reference }}
            </span>
          </div>

          <!-- Info del precio -->
          <div
            v-if="districtId"
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
              @click="close"
              class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!meta.valid || isSubmitting || isLoadingLocations"
              class="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 cursor-pointer"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                <font-awesome-icon icon="fa-solid fa-spinner" spin />
                Guardando...
              </span>
              <span v-else>
                {{ props.editAddress ? 'Guardar cambios' : 'Agregar dirección' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ✅ ESTILOS PERSONALIZADOS PARA SCROLLBAR */

/* Para navegadores basados en WebKit (Chrome, Safari, Edge) */
.overflow-y-auto::-webkit-scrollbar {
  width: 10px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgb(243 244 246); /* gray-100 */
  border-radius: 10px;
  margin: 8px 0;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: rgb(31 41 55); /* gray-800 */
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgb(59 130 246), rgb(99 102 241)); /* blue-500 to indigo-500 */
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgb(59 130 246), rgb(99 102 241));
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgb(37 99 235), rgb(79 70 229)); /* blue-600 to indigo-600 */
}

/* Para Firefox */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgb(59 130 246) rgb(243 244 246);
}

.dark .overflow-y-auto {
  scrollbar-color: rgb(59 130 246) rgb(31 41 55);
}
</style>
