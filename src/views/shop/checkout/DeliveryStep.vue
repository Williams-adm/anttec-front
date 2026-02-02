<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AddressCard from '@/components/shop/checkout/address/AddressCard.vue'
import BranchCard from '@/components/shop/checkout/address/BranchCard.vue'
import { useCheckout } from '@/composables/usecheckout'
import { useAddress } from '@/composables/useaddress'
import type { addressSI } from '@/interfaces/shop/AddressSInterface'
import type { branchSI } from '@/interfaces/shop/BranchSInterface'
import AddressModalCreate from '@/components/shop/checkout/address/AddressModalCreate.vue'
import AddressModalEdit from '@/components/shop/checkout/address/AddressModalEdit.vue'
import CustomerInfo from '@/components/shop/checkout/address/CustomerInfo.vue'

const {
  deliveryInfo,
  availableBranches,
  isLoadingBranches,
  setShippingMethod,
  setDeliveryAddress,
  setPickupBranch,
  loadAvailableBranches,
  saveToLocalStorage,
  initCheckout,
  clearDeliveryAddress,
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

const selectedMethod = ref<'delivery' | 'pickup'>('delivery')

const createModalRef = ref<InstanceType<typeof AddressModalCreate> | null>(null)
const editModalRef = ref<InstanceType<typeof AddressModalEdit> | null>(null)

// ✅ Función para seleccionar la dirección favorita automáticamente
const autoSelectFavorite = () => {
  if (
    selectedMethod.value === 'delivery' &&
    favoriteAddress.value &&
    !deliveryInfo.value?.address_id
  ) {
    handleSelectAddress(favoriteAddress.value)
  }
}

onMounted(async () => {
  await initCheckout()

  // Cargar datos en paralelo
  await Promise.all([loadAddresses(), loadFavoriteAddress(), loadAvailableBranches()])

  if (deliveryInfo.value) {
    selectedMethod.value = deliveryInfo.value.shipping_method
  } else {
    setShippingMethod('delivery')
  }

  // ✅ Auto-seleccionar favorita después de cargar
  autoSelectFavorite()
})

watch(selectedMethod, (newMethod) => {
  setShippingMethod(newMethod)
  saveToLocalStorage()
})

const handleSelectAddress = (address: addressSI) => {
  setDeliveryAddress(address)
  saveToLocalStorage()
}

const handleSelectBranch = (branch: branchSI) => {
  setPickupBranch(branch)
  saveToLocalStorage()
}

const handleDeleteAddress = async (address: addressSI) => {
  try {
    const deletedAddressId = address.id
    await deleteAddress(address.id)

    // ✅ Usar el método del store
    if (deliveryInfo.value?.address_id === deletedAddressId) {
      clearDeliveryAddress()
    }

    autoSelectFavorite()
  } catch (error) {
    console.error('Error al eliminar dirección:', error)
    alert('Error al eliminar la dirección')
  }
}

const handleSetFavorite = async (address: addressSI) => {
  try {
    await setFavoriteAddress(address.id)
    // loadAddresses() ya se llamó dentro de setFavoriteAddress

    // ✅ Auto-seleccionar la nueva favorita
    autoSelectFavorite()
  } catch (error) {
    console.error('Error al establecer favorita:', error)
  }
}

const handleOpenCreateModal = () => {
  createModalRef.value?.open()
}

const handleEditAddress = (address: addressSI) => {
  // Pasar solo el ID, el modal se encarga de cargar los datos
  editModalRef.value?.open(address.id)
}

// ✅ CORREGIDO: Recargar direcciones y re-seleccionar la dirección actual
const handleAddressSaved = async () => {
  // Guardar el ID de la dirección actualmente seleccionada
  const currentAddressId = deliveryInfo.value?.address_id

  // Recargar todas las direcciones para obtener los datos actualizados
  await loadAddresses()
  await loadFavoriteAddress()

  // Si había una dirección seleccionada, re-seleccionarla con los datos actualizados
  if (currentAddressId) {
    const updatedAddress = sortedAddresses.value.find((addr) => addr.id === currentAddressId)
    if (updatedAddress) {
      // ✅ Forzar re-selección para actualizar el precio
      handleSelectAddress(updatedAddress)
    }
  } else {
    // Si no había dirección seleccionada, auto-seleccionar favorita
    autoSelectFavorite()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Selector de método de envío -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Método de envío</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Delivery -->
        <label
          class="relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
          :class="[
            selectedMethod === 'delivery'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600',
          ]"
        >
          <input type="radio" v-model="selectedMethod" value="delivery" class="sr-only" />
          <div class="flex items-center gap-3 w-full">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              :class="
                selectedMethod === 'delivery' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              "
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
                :class="
                  selectedMethod === 'delivery'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-gray-100'
                "
              >
                Envío a domicilio
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Recibe en tu dirección</p>
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
              : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600',
          ]"
        >
          <input type="radio" v-model="selectedMethod" value="pickup" class="sr-only" />
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
                :class="
                  selectedMethod === 'pickup'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-900 dark:text-gray-100'
                "
              >
                Recojo en tienda
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Retira en nuestro local</p>
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
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Dirección de entrega</h2>
          <button
            @click="handleOpenCreateModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-md cursor-pointer"
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
          class="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700"
        >
          <font-awesome-icon icon="fa-solid fa-location-dot" class="text-5xl text-gray-400 mb-4" />
          <p class="text-gray-600 dark:text-gray-400 mb-4">No tienes direcciones registradas</p>
          <button
            @click="handleOpenCreateModal"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Agregar mi primera dirección
          </button>
        </div>

        <!-- Lista de direcciones -->
        <div v-else class="grid grid-cols-1 gap-4">
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
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
      >
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
            :selected="deliveryInfo?.branch_id === branch.address.id"
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

    <CustomerInfo />

    <!-- Modales -->
    <AddressModalCreate ref="createModalRef" @saved="handleAddressSaved" />

    <AddressModalEdit ref="editModalRef" @saved="handleAddressSaved" />
  </div>
</template>
