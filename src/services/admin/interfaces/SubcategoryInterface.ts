import type { paginatedResponseI } from "./PaginationInterface"

export interface subcategoryI {
  id: number,
  name: string,
  category: string,
  status: boolean
}
export type subcategoriesI = paginatedResponseI<subcategoryI>
