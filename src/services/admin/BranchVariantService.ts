import type { branchVariantI } from '@/interfaces/admin/BranchVariantInterface'
import httpAPI from '../httpAPI'
import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'

class BranchVariantService {
  private api = httpAPI

  async getAllList(): Promise<branchVariantI[]> {
    const res = await this.api.get<ApiListResponseI<branchVariantI[]>>(
      '/admin/branch-variants/list',
    )
    console.log(res.data.message)
    return res.data.data
  }
}

export default new BranchVariantService()
