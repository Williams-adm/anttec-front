import type { brandUpdateDTO } from '@/DTOs/admin/brand/BrandUpdateDTO'
import type { categoryCreateDTO } from '@/DTOs/admin/category/CategoryCreateDTO'
import type { brandI, brandsI } from '@/interfaces/admin/BrandInterface'
import httpAPI from '../httpAPI'
import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'

class BrandService {
  private api = httpAPI

  async getAll(): Promise<brandsI> {
    const res = await this.api.get<brandsI>('/admin/brands')
    console.log(res.data.message)
    return res.data
  }

  async getById(id: string): Promise<brandI> {
    const res = await this.api.get<ApiListResponseI<brandI>>(`/admin/brands/${id}`)
    console.log(res.data.message)
    return res.data.data
  }

  async create(data: categoryCreateDTO): Promise<brandI> {
    const res = await this.api.post<ApiListResponseI<brandI>>('/admin/brands', data)
    console.log(res.data.message)
    return res.data.data
  }

  async update(data: brandUpdateDTO, id: string): Promise<brandI> {
    const res = await this.api.patch<ApiListResponseI<brandI>>(`/admin/brands/${id}`, data)
    console.log(res.data.message)
    return res.data.data
  }

  async getAllList(): Promise<brandI[]> {
    const res = await this.api.get<ApiListResponseI<brandI[]>>('/admin/brands/list')
    console.log(res.data.message)
    return res.data.data
  }
}

export default new BrandService()
