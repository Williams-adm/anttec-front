<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCheckout } from '@/composables/usecheckout'
import CheckoutSummaryBase from '../CheckoutSummaryBase.vue'

const { checkoutState, isBillingInfoValid, canProceedToNextStep, prepareOrderData } = useCheckout()

// Estado local para el paso de pago
const isProcessingPayment = ref(false)

// El botón se habilitará solo cuando:
// 1. Los datos de facturación sean válidos (isBillingInfoValid)
// 2. No se esté procesando un pago
const canProceedToPayment = computed(() => {
  return canProceedToNextStep.value && !isProcessingPayment.value
})

// Mensaje dinámico del botón
const buttonMessage = computed(() => {
  if (isProcessingPayment.value) {
    return 'Procesando...'
  }

  if (!checkoutState.value.billing?.document_type) {
    return 'Selecciona un tipo de comprobante'
  }

  if (!isBillingInfoValid.value) {
    if (checkoutState.value.billing.document_type === 'boleta') {
      return 'Completa los datos de la boleta'
    } else {
      return 'Completa los datos de la factura'
    }
  }

  return 'Proceder al pago'
})

const handleProceedToPayment = async () => {
  if (!canProceedToPayment.value) return

  try {
    isProcessingPayment.value = true

    // Preparar datos de la orden
    const orderData = prepareOrderData()

    console.log('📦 Datos completos de la orden:', orderData)
    console.log('🚚 Delivery:', orderData.delivery)
    console.log('🧾 Billing:', orderData.billing)
    console.log('💰 Summary:', orderData.summary)

    // TODO: Aquí implementarás la lógica para:
    // 1. Crear la orden en el backend
    // const response = await orderService.createOrder(orderData)
    // 2. Redirigir a la pasarela de pago
    // window.location.href = response.payment_url

    // Simulación temporal
    await new Promise(resolve => setTimeout(resolve, 2000))

    alert('¡Orden preparada! (Implementa aquí la integración con tu backend)')

  } catch (error) {
    console.error('❌ Error al procesar el pago:', error)
    alert('Error al procesar el pago. Por favor, intenta nuevamente.')
  } finally {
    isProcessingPayment.value = false
  }
}
</script>

<template>
  <CheckoutSummaryBase
    :button-text="buttonMessage"
    :button-disabled="!canProceedToPayment"
    button-variant="green"
    @button-click="handleProceedToPayment"
  >
    <!-- Contenido adicional después del botón -->
    <template #after-button>
      <!-- Indicador de procesamiento -->
      <div
        v-if="isProcessingPayment"
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4"
      >
        <div class="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
          <font-awesome-icon icon="fa-solid fa-spinner" spin class="shrink-0" />
          <p>Procesando tu solicitud...</p>
        </div>
      </div>
    </template>
  </CheckoutSummaryBase>
</template>
