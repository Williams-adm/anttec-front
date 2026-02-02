import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'
import httpAdmin from '../httpAdmin'
import type { customerDNISI } from '@/interfaces/shop/Customer/CustomerDNISInterface'

class CustomerSService {
  private get api() {
    return httpAdmin
  }

  async getByDNI(dni: string | number): Promise<customerDNISI> {
    const res = await this.api.get<ApiListResponseI<customerDNISI>>(`/customers/${dni}`, )
    console.log(res.data.message)
    return res.data.data
  }
}

export default CustomerSService
