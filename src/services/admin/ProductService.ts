import type { ProductExtendI, ProductsI } from '@/interfaces/admin/ProductInterface'
import httpAPI from '../httpAPI'
import type { productCreateDTO } from '@/DTOs/admin/product/ProductCreateDTO'
import type { ApiListResponseI } from '@/interfaces/admin/ApiListResponseInterface'

class ProductService {
  private api = httpAPI

  async getAll(): Promise<ProductsI> {
    const res = await this.api.get<ProductsI>('/admin/products')
    console.log(res.data.message)
    return res.data
  }

  async create(data: productCreateDTO): Promise<ProductExtendI> {
    const res = await this.api.post<ApiListResponseI<ProductExtendI>>('/admin/categories', data)
    console.log(res.data.message)
    return res.data.data
  }
}

export default new ProductService()
