import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'
import type { categorySI } from '@/interfaces/shop/CategorySInterface'
import httpPublic from '../httpPublic'

class CategorySService {
  private api = httpPublic

  async getAll(): Promise<categorySI[]> {
    const res = await this.api.get<ApiListResponseI<categorySI[]>>('categories')
    console.log(res.data.message)
    return res.data.data
  }
}

export default new CategorySService()
