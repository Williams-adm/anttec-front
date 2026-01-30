import { useCheckoutStore } from '@/stores/useCheckoutstore'
import { storeToRefs } from 'pinia'

export const useCheckout = () => {
  const checkoutStore = useCheckoutStore()

  const {
    checkoutState,
    currentStep,
    isLoading,
    availableBranches,
    isLoadingBranches,
    deliveryInfo,
    shippingCost,
    summary,
    stepValidation,
    isDeliveryStepValid,
    canProceedToNextStep,
  } = storeToRefs(checkoutStore)

  const {
    goToStep,
    nextStep,
    prevStep,
    setShippingMethod,
    setDeliveryAddress,
    setPickupBranch,
    setCustomerData,
    updateCustomerData,
    loadAvailableBranches,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearCheckout,
    initCheckout,
    prepareOrderData,
  } = checkoutStore

  return {
    // State
    checkoutState,
    currentStep,
    isLoading,
    availableBranches,
    isLoadingBranches,

    // Getters
    deliveryInfo,
    shippingCost,
    summary,
    stepValidation,
    isDeliveryStepValid,
    canProceedToNextStep,

    // Actions
    goToStep,
    nextStep,
    prevStep,
    setShippingMethod,
    setDeliveryAddress,
    setPickupBranch,
    setCustomerData,
    updateCustomerData,
    loadAvailableBranches,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearCheckout,
    initCheckout,
    prepareOrderData,
  }
}
