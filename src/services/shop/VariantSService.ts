import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'
import httpPublic from '../httpPublic'
import type { variantSI } from '@/interfaces/shop/Variant/VariantSInterface'


class VariantSService {
  private api = httpPublic

  async getVariant(productId: string | number, variantId: string | number): Promise<variantSI> {
    const res = await this.api.get<ApiListResponseI<variantSI>>(
      `/products/${productId}/variants/${variantId}`,
    )
    console.log(res.data.message)
    return res.data.data
  }
}

export default new VariantSService()
