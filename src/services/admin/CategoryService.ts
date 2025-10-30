import type { categoriesI, categoryI } from './interfaces/CategoryInterface'
import type { categoryCreateDTO } from '@/DTOs/admin/category/CategoryCreateDTO'
import type { categoryUpdateDTO } from '@/DTOs/admin/category/CategoryUpdateDTO'
import httpAPI from '../httpAPI'

class CategoryService {
  private api = httpAPI

  async getAll(): Promise<categoriesI> {
    const res = await this.api.get('/admin/categories')
    console.log(res.data.message)
    return res.data as categoriesI
  }

  async getById(id: string): Promise<categoryI> {
    const res = await this.api.get(`/admin/categories/${id}`)
    console.log(res.data.message)
    return res.data.data as categoryI
  }

  async create(data: categoryCreateDTO): Promise<categoryI> {
    const res = await this.api.post('/admin/categories', data)
    console.log(res.data.message)
    return res.data.data as categoryI
  }

  async update(data: categoryUpdateDTO, id: string): Promise<categoryI> {
    const res = await this.api.patch(`/admin/categories/${id}`, data)
    console.log(res.data.message)
    return res.data.data as categoryI
  }
}

export default new CategoryService()
