import { useAddressStore } from '@/stores/useAddressStore'
import { storeToRefs } from 'pinia'

export const useAddress = () => {
  const addressStore = useAddressStore()

  const {
    addresses,
    favoriteAddress,
    isLoading,
    error,
    departments,
    provinces,
    districts,
    isLoadingLocations,
    hasAddresses,
    sortedAddresses,
  } = storeToRefs(addressStore)

  const {
    loadAddresses,
    loadFavoriteAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setFavoriteAddress,
    loadDepartments,
    loadProvinces,
    loadDistricts,
    getDistrictDeliveryPrice,
    clearProvinces,
    clearDistricts,
    reset,
  } = addressStore

  return {
    // State
    addresses,
    favoriteAddress,
    isLoading,
    error,
    departments,
    provinces,
    districts,
    isLoadingLocations,

    // Getters
    hasAddresses,
    sortedAddresses,

    // Actions
    loadAddresses,
    loadFavoriteAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setFavoriteAddress,
    loadDepartments,
    loadProvinces,
    loadDistricts,
    getDistrictDeliveryPrice,
    clearProvinces,
    clearDistricts,
    reset,
  }
}
