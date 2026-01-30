import BranchSService from '@/services/shop/BranchSService'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useCartStore } from './useCartStore'
import type {
  CheckoutStateSI,
  CheckoutSummarySI,
  CustomerDataSI,
  StepValidationSI,
} from '@/interfaces/shop/Checkoutsinterface'
import type { branchSI } from '@/interfaces/shop/BranchSInterface'
import type { ShippingMethodType } from '@/interfaces/shop/Shippingsinterface '
import type { addressSI } from '@/interfaces/shop/AddressSInterface'

const branchSService = new BranchSService()

export const useCheckoutStore = defineStore('checkout', () => {
  const cartStore = useCartStore()

  // State
  const checkoutState = ref<CheckoutStateSI>({})
  const currentStep = ref<number>(2) // 1: Carrito (fuera), 2: Entrega, 3: Pago
  const isLoading = ref(false)

  // State para sucursales disponibles
  const availableBranches = ref<branchSI[]>([])
  const isLoadingBranches = ref(false)

  // Getters
  const deliveryInfo = computed(() => checkoutState.value.delivery)
  const shippingCost = computed(() => deliveryInfo.value?.shipping_cost || 0)

  const summary = computed((): CheckoutSummarySI => {
    const cartTotal = cartStore.totals.total
    const shipping = shippingCost.value
    const discount = 0

    return {
      subtotal: cartTotal,
      shipping_cost: shipping,
      discount: discount,
      total: cartTotal + shipping - discount,
      items_count: cartStore.totals.items_count,
    }
  })

  // Validación de pasos
  const stepValidation = computed((): StepValidationSI => {
    return {
      cart: !cartStore.isEmpty, // Paso 1: Carrito tiene items
      delivery: isDeliveryStepValid.value, // Paso 2: Entrega completada
      payment: false, // Paso 3: Pago (se validará después)
    }
  })

  const isDeliveryStepValid = computed(() => {
    const delivery = deliveryInfo.value
    if (!delivery) return false

    // Validar datos del cliente
    const customerValid =
      delivery.customer.first_name.trim() !== '' &&
      delivery.customer.last_name.trim() !== '' &&
      delivery.customer.document_number.trim() !== '' &&
      delivery.customer.phone.trim() !== '' &&
      delivery.customer.email.trim() !== ''

    if (!customerValid) return false

    // Validar según método de envío
    if (delivery.shipping_method === 'delivery') {
      return delivery.address_id !== undefined && delivery.shipping_cost !== undefined
    } else if (delivery.shipping_method === 'pickup') {
      return delivery.branch_id !== undefined
    }

    return false
  })

  const canProceedToNextStep = computed(() => {
    switch (currentStep.value) {
      case 1:
        return stepValidation.value.cart
      case 2:
        return stepValidation.value.delivery
      case 3:
        return stepValidation.value.payment
      default:
        return false
    }
  })

  // Actions - Navegación de pasos
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3) {
      currentStep.value = step
      saveToLocalStorage()
    }
  }

  const nextStep = () => {
    if (canProceedToNextStep.value && currentStep.value < 3) {
      currentStep.value++
      saveToLocalStorage()
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
      saveToLocalStorage()
    }
  }

  // Actions - Información de entrega
  const setShippingMethod = (method: ShippingMethodType) => {
    if (!checkoutState.value.delivery) {
      checkoutState.value.delivery = {
        shipping_method: method,
        customer: {
          first_name: '',
          last_name: '',
          document_type: 'DNI',
          document_number: '',
          phone: '',
          email: '',
        },
      }
    } else {
      checkoutState.value.delivery.shipping_method = method

      if (method === 'delivery') {
        delete checkoutState.value.delivery.branch_id
        delete checkoutState.value.delivery.branch
      } else {
        delete checkoutState.value.delivery.address_id
        delete checkoutState.value.delivery.address
        checkoutState.value.delivery.shipping_cost = 0
      }
    }
    saveToLocalStorage()
  }

  const setDeliveryAddress = (address: addressSI) => {
    if (!checkoutState.value.delivery) {
      console.error('Debe establecer el método de envío primero')
      return
    }

    checkoutState.value.delivery.address_id = address.id
    checkoutState.value.delivery.address = address
    checkoutState.value.delivery.shipping_cost = address.delivery_price
    saveToLocalStorage()
  }

  const setPickupBranch = (branch: branchSI) => {
    if (!checkoutState.value.delivery) {
      console.error('Debe establecer el método de envío primero')
      return
    }

    checkoutState.value.delivery.branch_id = branch.id
    checkoutState.value.delivery.branch = branch
    checkoutState.value.delivery.shipping_cost = branch.delivery_price
    saveToLocalStorage()
  }

  const setCustomerData = (customer: CustomerDataSI) => {
    if (!checkoutState.value.delivery) {
      checkoutState.value.delivery = {
        shipping_method: 'delivery',
        customer: customer,
      }
    } else {
      checkoutState.value.delivery.customer = customer
    }
    saveToLocalStorage()
  }

  const updateCustomerData = (updates: Partial<CustomerDataSI>) => {
    if (!checkoutState.value.delivery) {
      console.error('Debe inicializar la información de entrega primero')
      return
    }

    checkoutState.value.delivery.customer = {
      ...checkoutState.value.delivery.customer,
      ...updates,
    }
    saveToLocalStorage()
  }

  const loadAvailableBranches = async () => {
    isLoadingBranches.value = true
    try {
      const branches = await branchSService.getAll()
      availableBranches.value = Array.isArray(branches) ? branches : [branches]
    } catch (error) {
      console.error('Error cargando sucursales:', error)
      availableBranches.value = []
      throw error
    } finally {
      isLoadingBranches.value = false
    }
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('checkout_state', JSON.stringify(checkoutState.value))
      localStorage.setItem('checkout_step', String(currentStep.value))
    } catch (error) {
      console.error('Error guardando estado del checkout:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedState = localStorage.getItem('checkout_state')
      const savedStep = localStorage.getItem('checkout_step')

      if (savedState) {
        checkoutState.value = JSON.parse(savedState)
      }

      if (savedStep) {
        currentStep.value = parseInt(savedStep, 10)
      }
    } catch (error) {
      console.error('Error cargando estado del checkout:', error)
    }
  }

  const clearCheckout = () => {
    checkoutState.value = {}
    currentStep.value = 2
    availableBranches.value = []

    localStorage.removeItem('checkout_state')
    localStorage.removeItem('checkout_step')
  }

  const initCheckout = async () => {
    loadFromLocalStorage()

    if (!checkoutState.value.delivery) {
      checkoutState.value.delivery = {
        shipping_method: 'delivery',
        customer: {
          first_name: '',
          last_name: '',
          document_type: 'DNI',
          document_number: '',
          phone: '',
          email: '',
        },
      }
    }
  }

  const prepareOrderData = () => {
    return {
      session_id: cartStore.sessionId,
      delivery: checkoutState.value.delivery,
      billing: checkoutState.value.billing,
      payment: checkoutState.value.payment,
      summary: summary.value,
    }
  }

  return {
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
})
