import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'
import type { variantI, variantsI } from '@/interfaces/admin/variant/variantInterface'
import type { variantShortsI } from '@/interfaces/admin/variant/variantShortInterface'
import httpAPI from '../httpAPI'

class VariantService {
  private api = httpAPI

  async getAll(): Promise<variantsI> {
    const res = await this.api.get<variantsI>('/admin/variants')
    console.log(res.data.message)
    return res.data
  }

  async getById(id: string): Promise<variantI> {
    const res = await this.api.get<ApiListResponseI<variantI>>(`/admin/variants/${id}`)
    console.log(res.data.message)
    return res.data.data
  }

  async getAllShort(id: string): Promise<variantShortsI> {
    const res = await this.api.get<variantShortsI>(`/admin/variants/product/${id}/short`)
    console.log(res.data.message)
    return res.data
  }

  async updateStatus(data: Record<string, boolean>, id: string): Promise<variantI> {
    const res = await this.api.patch<ApiListResponseI<variantI>>(`/admin/variants/${id}`, data)
    console.log(res.data.message)
    return res.data.data
  }

  /* async update(data: FormData, id: string): Promise<any> {
    const res = await this.api.post<ApiListResponseI<any>>(`/admin/variants/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(res.data.message)
    return res.data.data
  } */

  async create(data: FormData): Promise<variantI> {
    const res = await this.api.post<ApiListResponseI<variantI>>('/admin/variants', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(res.data.message)
    return res.data.data
  }
}

export default new VariantService()
