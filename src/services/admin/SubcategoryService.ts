import type { subcategoryUpdateDTO } from '@/DTOs/admin/subcategory/SubcategoryUpdateDTO'
import type { subcategoriesI, subcategoryI } from '../../interfaces/admin/SubcategoryInterface'
import httpAPI from '../httpAPI'
import type { subcategoryCreateDTO } from '@/DTOs/admin/subcategory/SubcategoryCreateDTO'
import type { ApiListResponseI } from '@/interfaces/admin/ApiListResponseInterface'

class SubcategoryService {
  private api = httpAPI

  async getAll(): Promise<subcategoriesI> {
    const res = await this.api.get<subcategoriesI>('/admin/subcategories')
    console.log(res.data.message)
    return res.data
  }

  async getById(id: string): Promise<subcategoryI> {
    const res = await this.api.get<ApiListResponseI<subcategoryI>>(`/admin/subcategories/${id}`)
    console.log(res.data.message)
    return res.data.data
  }

  async create(data: subcategoryCreateDTO): Promise<subcategoryI> {
    const res = await this.api.post<ApiListResponseI<subcategoryI>>('/admin/subcategories', data)
    console.log(res.data.message)
    return res.data.data
  }

  async update(data: subcategoryUpdateDTO, id: string): Promise<subcategoryI> {
    const res = await this.api.patch(`/admin/subcategories/${id}`, data)
    console.log(res.data.message)
    return res.data.data as subcategoryI
  }
}

export default new SubcategoryService()
