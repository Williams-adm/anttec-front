import type { addressCheckoutCreateDTO } from '@/DTOs/shop/address/AddressCheckoutCreateDTO'
import type { addressCheckoutUpdateDTO } from '@/DTOs/shop/address/AddressCheckoutUpdateDTO'
import type { generalI } from '@/interfaces/admin/address/generalnterface'
import type { addressSI } from '@/interfaces/shop/AddressSInterface'
import AddressSService from '@/services/shop/AddressSService'
import LocationSService from '@/services/shop/LocationSService'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const addressSService = new AddressSService()
const locationSService = new LocationSService()

export const useAddressStore = defineStore('address', () => {
  // State
  const addresses = ref<addressSI[]>([])
  const favoriteAddress = ref<addressSI | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // State para ubicaciones geográficas
  const departments = ref<generalI[]>([])
  const provinces = ref<generalI[]>([])
  const districts = ref<generalI[]>([])
  const isLoadingLocations = ref(false)

  // Getters
  const hasAddresses = computed(() => addresses.value.length > 0)
  const sortedAddresses = computed(() => {
    // Ordenar poniendo primero la dirección favorita
    return [...addresses.value].sort((a, b) => {
      if (a.favorite) return -1
      if (b.favorite) return 1
      return 0
    })
  })

  // Actions - Direcciones
  const loadAddresses = async () => {
    isLoading.value = true
    error.value = null
    try {
      addresses.value = await addressSService.getAll()
    } catch (err) {
      error.value = 'Error al cargar las direcciones'
      console.error('Error loading addresses:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadFavoriteAddress = async () => {
    isLoading.value = true
    error.value = null
    try {
      favoriteAddress.value = await addressSService.favorite()
    } catch (err) {
      error.value = 'Error al cargar la dirección favorita'
      console.error('Error loading favorite address:', err)
      // No hacer throw aquí, ya que puede no existir dirección favorita
      favoriteAddress.value = null
    } finally {
      isLoading.value = false
    }
  }

  const createAddress = async (data: addressCheckoutCreateDTO): Promise<addressSI> => {
    isLoading.value = true
    error.value = null
    try {
      const newAddress = await addressSService.create(data)
      addresses.value.push(newAddress)

      // Si es la nueva dirección favorita, actualizar
      if (newAddress.favorite) {
        favoriteAddress.value = newAddress
        // Actualizar las demás direcciones localmente
        addresses.value = addresses.value.map((addr) => ({
          ...addr,
          favorite: addr.id === newAddress.id,
        }))
      }

      return newAddress
    } catch (err) {
      error.value = 'Error al crear la dirección'
      console.error('Error creating address:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateAddress = async (id: number, data: addressCheckoutUpdateDTO): Promise<addressSI> => {
    isLoading.value = true
    error.value = null
    try {
      const updatedAddress = await addressSService.update(id, data)

      const index = addresses.value.findIndex((addr) => addr.id === id)
      if (index !== -1) {
        // Si se estableció como favorita, actualizar las demás
        if (updatedAddress.favorite) {
          addresses.value = addresses.value.map((addr) => ({
            ...addr,
            favorite: addr.id === id,
          }))
          favoriteAddress.value = updatedAddress
        }

        addresses.value[index] = updatedAddress
      }

      return updatedAddress
    } catch (err) {
      error.value = 'Error al actualizar la dirección'
      console.error('Error updating address:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteAddress = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await addressSService.delete(id)
      addresses.value = addresses.value.filter((addr) => addr.id !== id)

      // Si era la dirección favorita, limpiar
      if (favoriteAddress.value?.id === id) {
        favoriteAddress.value = null
      }
    } catch (err) {
      error.value = 'Error al eliminar la dirección'
      console.error('Error deleting address:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setFavoriteAddress = async (id: number): Promise<addressSI> => {
    isLoading.value = true
    error.value = null
    try {
      // Usar update con favorite: true
      const updatedAddress = await addressSService.update(id, { favorite: true })

      // Actualizar todas las direcciones
      addresses.value = addresses.value.map((addr) => ({
        ...addr,
        favorite: addr.id === id,
      }))

      favoriteAddress.value = updatedAddress
      return updatedAddress
    } catch (err) {
      error.value = 'Error al establecer dirección favorita'
      console.error('Error setting favorite address:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Actions - Ubicaciones geográficas
  const loadDepartments = async () => {
    if (departments.value.length > 0) return // Ya cargados

    isLoadingLocations.value = true
    try {
      departments.value = await locationSService.getAllDepartments()
    } catch (err) {
      console.error('Error loading departments:', err)
      throw err
    } finally {
      isLoadingLocations.value = false
    }
  }

  const loadProvinces = async (departmentId: number) => {
    isLoadingLocations.value = true
    try {
      provinces.value = await locationSService.getAllProvinces(departmentId)
      // Limpiar distritos al cambiar de departamento
      districts.value = []
    } catch (err) {
      console.error('Error loading provinces:', err)
      throw err
    } finally {
      isLoadingLocations.value = false
    }
  }

  const loadDistricts = async (provinceId: number) => {
    isLoadingLocations.value = true
    try {
      districts.value = await locationSService.getAllDistricts(provinceId)
    } catch (err) {
      console.error('Error loading districts:', err)
      throw err
    } finally {
      isLoadingLocations.value = false
    }
  }

  // Obtener precio de envío de un distrito específico
  const getDistrictDeliveryPrice = (districtId: number): number => {
    districts.value.find((d) => d.id === districtId)
    // Nota: el backend devuelve districts como generalI (solo id y name)
    // El precio de envío vendrá en la dirección cuando se cree/actualice
    return 0 // Por defecto, el precio lo obtendremos de la dirección creada
  }

  // Limpiar provincias y distritos
  const clearProvinces = () => {
    provinces.value = []
    districts.value = []
  }

  const clearDistricts = () => {
    districts.value = []
  }

  // Reset
  const reset = () => {
    addresses.value = []
    favoriteAddress.value = null
    error.value = null
    departments.value = []
    provinces.value = []
    districts.value = []
  }

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
})
