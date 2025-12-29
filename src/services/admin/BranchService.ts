import type { branchesI } from '@/interfaces/admin/branch/BranchInterface'
import httpAPI from '../httpAPI'

class BranchService {
  private api = httpAPI

  async getAll(): Promise<branchesI> {
    const res = await this.api.get<branchesI>('/admin/branches')
    console.log(res.data.message)
    return res.data
  }
}

export default new BranchService()
