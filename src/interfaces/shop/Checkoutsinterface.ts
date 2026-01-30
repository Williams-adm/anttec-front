import type { addressSI } from './AddressSInterface'
import type { branchSI } from './BranchSInterface'
import type { ShippingMethodType } from './Shippingsinterface '

// Datos del cliente para el pedido
export interface CustomerDataSI {
  first_name: string
  last_name: string
  document_type: 'DNI' | 'CE' | 'Pasaporte' | 'RUC'
  document_number: string
  phone: string
  email: string
}

// Información de entrega
export interface DeliveryInfoSI {
  shipping_method: ShippingMethodType

  // Para delivery
  address_id?: number
  address?: addressSI
  shipping_cost?: number

  // Para pickup
  branch_id?: number
  branch?: branchSI

  // Datos del cliente
  customer: CustomerDataSI
}

// Estado completo del checkout
export interface CheckoutStateSI {
  // Paso 1: Entrega
  delivery?: DeliveryInfoSI

  // Paso 2: Facturación (para futuro)
  billing?: {
    requires_invoice: boolean
    company_name?: string
    ruc?: string
    fiscal_address?: string
  }

  // Paso 3: Pago (para futuro)
  payment?: {
    method: string
    // Otros datos de pago
  }

  // Resumen
  summary?: CheckoutSummarySI
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
