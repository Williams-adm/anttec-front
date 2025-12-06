import type { specificationCreateDTO } from '@/DTOs/admin/specification/SpecificationCreateDTO'
import type { specificationUpdateDTO } from '@/DTOs/admin/specification/SpecificationUpdateDTO'
import type { SpecificationI, SpecificationsI } from '@/interfaces/admin/SpecificationInterface'
import httpAPI from '../httpAPI'
import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'

class SpecificationService {
  private api = httpAPI

  async getAll(): Promise<SpecificationsI> {
    const res = await this.api.get<SpecificationsI>('/admin/specifications')
    console.log(res.data.message)
    return res.data
  }

  async getById(id: string): Promise<SpecificationI> {
    const res = await this.api.get<ApiListResponseI<SpecificationI>>(`/admin/specifications/${id}`)
    console.log(res.data.message)
    return res.data.data
  }

  async create(data: specificationCreateDTO): Promise<SpecificationI> {
    const res = await this.api.post<ApiListResponseI<SpecificationI>>('/admin/specifications', data)
    console.log(res.data.message)
    return res.data.data
  }

  async update(data: specificationUpdateDTO, id: string): Promise<SpecificationI> {
    const res = await this.api.patch<ApiListResponseI<SpecificationI>>(
      `/admin/specifications/${id}`,
      data,
    )
    console.log(res.data.message)
    return res.data.data
  }

  async getAllList(): Promise<SpecificationI[]> {
    const res = await this.api.get<ApiListResponseI<SpecificationI[]>>('/admin/specifications/list')
    console.log(res.data.message)
    return res.data.data
  }
}

export default new SpecificationService()
