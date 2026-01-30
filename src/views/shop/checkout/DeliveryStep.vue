<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import AddressCard from '@/components/shop/checkout/AddressCard.vue'
import BranchCard from '@/components/shop/checkout/address/BranchCard.vue'
import AddressModal from '@/components/shop/checkout/address/AddressModal.vue'
import { useCheckout } from '@/composables/usecheckout'
import { useAddress } from '@/composables/useaddress'
import type { addressSI } from '@/interfaces/shop/AddressSInterface'
import type { branchSI } from '@/interfaces/shop/BranchSInterface'

const router = useRouter()

const {
  deliveryInfo,
  availableBranches,
  isLoadingBranches,
  setShippingMethod,
  setDeliveryAddress,
  setPickupBranch,
  setCustomerData,
  updateCustomerData,
  loadAvailableBranches,
  saveToLocalStorage,
  initCheckout,
  canProceedToNextStep,
  nextStep,
} = useCheckout()

const {
  sortedAddresses,
  favoriteAddress,
  hasAddresses,
  isLoading: isLoadingAddresses,
  loadAddresses,
  loadFavoriteAddress,
  setFavoriteAddress,
  deleteAddress,
} = useAddress()

// State local
const selectedMethod = ref<'delivery' | 'pickup'>('delivery')
const showAddressModal = ref(false)
const editingAddress = ref<addressSI | null>(null)

const customerForm = ref({
  first_name: '',
  last_name: '',
  document_type: 'DNI' as 'DNI' | 'CE' | 'Pasaporte' | 'RUC',
  document_number: '',
  phone: '',
  email: '',
})

// Cargar datos iniciales
onMounted(async () => {
  await initCheckout()
  await Promise.all([
    loadAddresses(),
    loadFavoriteAddress(),
    loadAvailableBranches(),
  ])

  // Pre-seleccionar método de envío si ya existe
  if (deliveryInfo.value) {
    selectedMethod.value = deliveryInfo.value.shipping_method
    // Pre-llenar formulario de cliente si ya existe
    if (deliveryInfo.value.customer) {
      customerForm.value = { ...deliveryInfo.value.customer }
    }
  } else {
    // Inicializar con delivery por defecto
    setShippingMethod('delivery')
  }

  // Si hay dirección favorita y es delivery, pre-seleccionarla
  if (selectedMethod.value === 'delivery' && favoriteAddress.value && !deliveryInfo.value?.address_id) {
    handleSelectAddress(favoriteAddress.value)
  }
})

// Watch para cambios en el método de envío
watch(selectedMethod, (newMethod) => {
  setShippingMethod(newMethod)
  saveToLocalStorage()
})

// Watch para cambios en el formulario de cliente
watch(customerForm, (newData) => {
  updateCustomerData(newData)
  saveToLocalStorage()
}, { deep: true })

// Handlers
const handleSelectAddress = (address: addressSI) => {
  setDeliveryAddress(address)
  saveToLocalStorage()
}

const handleSelectBranch = (branch: branchSI) => {
  setPickupBranch(branch)
  saveToLocalStorage()
}

const handleOpenAddressModal = () => {
  editingAddress.value = null
  showAddressModal.value = true
}

const handleEditAddress = (address: addressSI) => {
  editingAddress.value = address
  showAddressModal.value = true
}

const handleDeleteAddress = async (address: addressSI) => {
  if (confirm('¿Estás seguro de eliminar esta dirección?')) {
    try {
      await deleteAddress(address.id)
      // Si era la dirección seleccionada, limpiar selección
      if (deliveryInfo.value?.address_id === address.id) {
        // Seleccionar la primera dirección disponible o limpiar
        if (sortedAddresses.value.length > 0) {
          handleSelectAddress(sortedAddresses.value[0])
        }
      }
    } catch (error) {
      console.error('Error al eliminar dirección:', error)
      alert('Error al eliminar la dirección')
    }
  }
}

const handleSetFavorite = async (address: addressSI) => {
  try {
    await setFavoriteAddress(address.id)
  } catch (error) {
    console.error('Error al establecer favorita:', error)
  }
}

const handleAddressSaved = async (address: addressSI) => {
  // Recargar direcciones
  await loadAddresses()
  // Seleccionar la nueva dirección
  handleSelectAddress(address)
}

const handleContinue = () => {
  if (canProceedToNextStep.value) {
    nextStep()
    router.push({ name: 'checkout.payment' })
  }
}

// Validación del formulario de cliente
const isCustomerFormValid = computed(() => {
  return (
    customerForm.value.first_name.trim() !== '' &&
    customerForm.value.last_name.trim() !== '' &&
    customerForm.value.document_number.trim() !== '' &&
    customerForm.value.phone.trim() !== '' &&
    customerForm.value.email.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.value.email)
  )
})

const isDeliverySelected = computed(() => {
  return selectedMethod.value === 'delivery' && deliveryInfo.value?.address_id !== undefined
})

const isPickupSelected = computed(() => {
  return selectedMethod.value === 'pickup' && deliveryInfo.value?.branch_id !== undefined
})
</script>

<template>
  <div class="space-y-6">
    <!-- Selector de método de envío -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
        Método de envío
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Delivery -->
        <label
          class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
          :class="[
            selectedMethod === 'delivery'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
          ]"
        >
          <input
            type="radio"
            v-model="selectedMethod"
            value="delivery"
            class="sr-only"
          />
          <div class="flex items-center gap-3 w-full">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              :class="selectedMethod === 'delivery' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <font-awesome-icon
                icon="fa-solid fa-truck-fast"
                class="text-xl"
                :class="selectedMethod === 'delivery' ? 'text-white' : 'text-gray-500'"
              />
            </div>
            <div class="flex-1">
              <p
                class="font-bold"
                :class="selectedMethod === 'delivery' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'"
              >
                Envío a domicilio
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Recibe en tu dirección
              </p>
            </div>
            <font-awesome-icon
              v-if="selectedMethod === 'delivery'"
              icon="fa-solid fa-check-circle"
              class="text-2xl text-blue-600 dark:text-blue-400"
            />
          </div>
        </label>

        <!-- Pickup -->
        <label
          class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
          :class="[
            selectedMethod === 'pickup'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'
          ]"
        >
          <input
            type="radio"
            v-model="selectedMethod"
            value="pickup"
            class="sr-only"
          />
          <div class="flex items-center gap-3 w-full">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              :class="selectedMethod === 'pickup' ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <font-awesome-icon
                icon="fa-solid fa-shop"
                class="text-xl"
                :class="selectedMethod === 'pickup' ? 'text-white' : 'text-gray-500'"
              />
            </div>
            <div class="flex-1">
              <p
                class="font-bold"
                :class="selectedMethod === 'pickup' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'"
              >
                Recojo en tienda
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Retira en nuestro local
              </p>
            </div>
            <font-awesome-icon
              v-if="selectedMethod === 'pickup'"
              icon="fa-solid fa-check-circle"
              class="text-2xl text-green-600 dark:text-green-400"
            />
          </div>
        </label>
      </div>
    </div>

    <!-- Sección de direcciones (si es delivery) -->
    <div v-if="selectedMethod === 'delivery'" class="space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">
            Dirección de entrega
          </h2>
          <button
            @click="handleOpenAddressModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-md"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
            <span class="hidden sm:inline">Nueva dirección</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isLoadingAddresses" class="flex justify-center py-12">
          <font-awesome-icon icon="fa-solid fa-spinner" spin class="text-4xl text-blue-600" />
        </div>

        <!-- No hay direcciones -->
        <div
          v-else-if="!hasAddresses"
          class="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700"
        >
          <font-awesome-icon icon="fa-solid fa-location-dot" class="text-5xl text-gray-400 mb-4" />
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            No tienes direcciones registradas
          </p>
          <button
            @click="handleOpenAddressModal"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Agregar mi primera dirección
          </button>
        </div>

        <!-- Lista de direcciones -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AddressCard
            v-for="address in sortedAddresses"
            :key="address.id"
            :address="address"
            :selected="deliveryInfo?.address_id === address.id"
            @select="handleSelectAddress"
            @edit="handleEditAddress"
            @delete="handleDeleteAddress"
            @set-favorite="handleSetFavorite"
          />
        </div>
      </div>
    </div>

    <!-- Sección de sucursales (si es pickup) -->
    <div v-if="selectedMethod === 'pickup'" class="space-y-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Selecciona la tienda para recojo
        </h2>

        <!-- Loading -->
        <div v-if="isLoadingBranches" class="flex justify-center py-12">
          <font-awesome-icon icon="fa-solid fa-spinner" spin class="text-4xl text-green-600" />
        </div>

        <!-- Lista de sucursales -->
        <div v-else class="grid grid-cols-1 gap-4">
          <BranchCard
            v-for="branch in availableBranches"
            :key="branch.id"
            :branch="branch"
            :selected="deliveryInfo?.branch_id === branch.id"
            @select="handleSelectBranch"
          />
        </div>

        <!-- No hay sucursales -->
        <div
          v-if="!isLoadingBranches && availableBranches.length === 0"
          class="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl"
        >
          <font-awesome-icon icon="fa-solid fa-shop" class="text-5xl text-gray-400 mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            No hay sucursales disponibles en este momento
          </p>
        </div>
      </div>
    </div>

    <!-- Datos del cliente -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <font-awesome-icon icon="fa-solid fa-user" />
        Datos del cliente
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nombres -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nombres *
          </label>
          <input
            v-model="customerForm.first_name"
            type="text"
            required
            placeholder="Ingresa tus nombres"
            class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
          />
        </div>

        <!-- Apellidos -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Apellidos *
          </label>
          <input
            v-model="customerForm.last_name"
            type="text"
            required
            placeholder="Ingresa tus apellidos"
            class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
          />
        </div>

        <!-- Tipo de documento -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tipo de documento *
          </label>
          <select
            v-model="customerForm.document_type"
            required
            class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
          >
            <option value="DNI">DNI</option>
            <option value="CE">Carnet de Extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="RUC">RUC</option>
          </select>
        </div>

        <!-- Número de documento -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Número de documento *
          </label>
          <input
            v-model="customerForm.document_number"
            type="text"
            required
            placeholder="Ingresa tu documento"
            class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Teléfono *
          </label>
          <input
            v-model="customerForm.phone"
            type="tel"
            required
            placeholder="Ej: 999 999 999"
            class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            v-model="customerForm.email"
            type="email"
            required
            placeholder="tu@email.com"
            class="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>

    <!-- Botones de navegación -->
    <div class="flex flex-col sm:flex-row gap-4">

      <button
        @click="handleContinue"
        :disabled="!canProceedToNextStep || !isCustomerFormValid"
        class="flex-1 px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 text-lg"
      >
        Continuar al pago
        <font-awesome-icon icon="fa-solid fa-angle-right" class="ml-2" />
      </button>
    </div>

    <!-- Modal de dirección -->
    <AddressModal
      :is-open="showAddressModal"
      :edit-address="editingAddress"
      @close="showAddressModal = false"
      @saved="handleAddressSaved"
    />
  </div>
</template>
