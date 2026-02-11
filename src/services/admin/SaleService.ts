import httpAdmin from '../httpAdmin'
import type { salesI } from '@/interfaces/admin/SaleInterface'

class SaleService {
  private get api() {
    return httpAdmin
  }

  async getAll(): Promise<salesI> {
    const res = await this.api.get<salesI>('/admin/sales')
    console.log(res.data.message)
    return res.data
  }
}

export default SaleService
