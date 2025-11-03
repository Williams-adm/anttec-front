import type { paginatedResponseI } from './PaginationInterface'

export interface brandI {
  id: number
  name: string
  status: boolean
}

export type brandsI = paginatedResponseI<brandI>
