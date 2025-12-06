import type { categoriesI, categoryI, categorySubI } from '@/interfaces/admin/CategoryInterface'
import type { categoryCreateDTO } from '@/DTOs/admin/category/CategoryCreateDTO'
import type { categoryUpdateDTO } from '@/DTOs/admin/category/CategoryUpdateDTO'
import httpAPI from '../httpAPI'
import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'

class CategoryService {
  private api = httpAPI

  async getAll(): Promise<categoriesI> {
    const res = await this.api.get<categoriesI>('/admin/categories')
    console.log(res.data.message)
    return res.data
  }

  async getById(id: string): Promise<categoryI> {
    const res = await this.api.get<ApiListResponseI<categoryI>>(`/admin/categories/${id}`)
    console.log(res.data.message)
    return res.data.data
  }

  async create(data: categoryCreateDTO): Promise<categoryI> {
    const res = await this.api.post<ApiListResponseI<categoryI>>('/admin/categories', data)
    console.log(res.data.message)
    return res.data.data
  }

  async update(data: categoryUpdateDTO, id: string): Promise<categoryI> {
    const res = await this.api.patch<ApiListResponseI<categoryI>>(`/admin/categories/${id}`, data)
    console.log(res.data.message)
    return res.data.data
  }

  async getAllList(): Promise<categoryI[]> {
    const res = await this.api.get<ApiListResponseI<categoryI[]>>('/admin/categories/list')
    console.log(res.data.message)
    return res.data.data
  }

  async getAllSubcategories(id: string): Promise<categorySubI[]> {
    const res = await this.api.get<ApiListResponseI<categorySubI[]>>(
      `/admin/categories/${id}/subcategories`,
    )
    console.log(res.data.message)
    return res.data.data
  }
}

export default new CategoryService()
