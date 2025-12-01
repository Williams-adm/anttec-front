import type { paginatedResponseI } from "./PaginationInterface"
import type { ProductSpecificationI } from "./ProductSpecificationInterface"

export interface ProductI {
  id: number,
  name: string,
  model: string,
  subcategory: string,
  brand: string
  status: boolean,
}

export interface ProductExtendI {
  id: number
  name: string
  model: string
  description?: string
  category: string
  subcategory: string
  brand: string
  status: boolean
  specifications: ProductSpecificationI[]
}

export type ProductsI = paginatedResponseI<ProductI>
