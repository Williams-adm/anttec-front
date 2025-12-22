import type { productCreateDTO } from '@/DTOs/admin/product/ProductCreateDTO'
import type { productUpdateDTO } from '@/DTOs/admin/product/ProductUpdateDTO'
import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'
import type { OptionProductI } from '@/interfaces/admin/optionProduct/OptionProductInterface'
import type { ProductExtendI, ProductsI } from '@/interfaces/admin/product/ProductInterface'
import httpAPI from '../httpAPI'

class ProductService {
  private api = httpAPI

  async getAll(): Promise<ProductsI> {
    const res = await this.api.get<ProductsI>('/admin/products')
    console.log(res.data.message)
    return res.data
  }

  async create(data: productCreateDTO): Promise<ProductExtendI> {
    const res = await this.api.post<ApiListResponseI<ProductExtendI>>('/admin/products', data)
    console.log(res.data.message)
    return res.data.data
  }

  async getById(id: string): Promise<ProductExtendI> {
    const res = await this.api.get<ApiListResponseI<ProductExtendI>>(`/admin/products/${id}`)
    console.log(res.data.message)
    return res.data.data
  }

  async update(data: productUpdateDTO, id: string): Promise<ProductExtendI> {
    const res = await this.api.patch<ApiListResponseI<ProductExtendI>>(
      `/admin/products/${id}`,
      data,
    )
    console.log(res.data.message)
    return res.data.data
  }

  async getOptions(id: string): Promise<OptionProductI[]> {
    const res = await this.api.get<ApiListResponseI<OptionProductI[]>>(
      `/admin/products/${id}/options`,
    )
    console.log(res.data.message)
    return res.data.data
  }
}

export default new ProductService()
