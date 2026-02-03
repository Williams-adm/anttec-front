import type { ShippingMethodType } from './Shippingsinterface '

// Datos del cliente para el pedido
export interface CustomerDataSI {
  first_name: string
  last_name: string
  document_type: 'DNI' | 'CE'
  document_number: string
  phone: string
}

// Información de entrega
export interface DeliveryInfoSI {
  shipping_method: ShippingMethodType

  // Para delivery
  address_id?: number
  shipping_cost?: number

  // Para pickup
  branch_id?: number

  // Datos del cliente
  reciber: CustomerDataSI
}

// Estado completo del checkout
export interface CheckoutStateSI {
  // Paso 1: Entrega
  delivery?: DeliveryInfoSI

  // Paso 2: Facturación (para futuro)
  billing?: BillingInfoSI

  // Paso 3: Pago (para futuro)
  payment?: {
    method: string
    // Otros datos de pago
  }

  // Resumen
  summary?: CheckoutSummarySI
}

export interface BillingInfoSI {
  document_type: 'boleta' | 'factura'
  customer_document_type?: 'DNI' | 'CE'
  document_number?: string
  name?: string
  last_name?: string
  business_name?: string
  address?: string
}

// Resumen del checkout
export interface CheckoutSummarySI {
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  items_count: number
}

// Validación de paso completado
export interface StepValidationSI {
  cart: boolean // Paso 1: Carrito tiene items
  delivery: boolean // Paso 2: Entrega completada
  payment: boolean // Paso 3: Pago completado
}
