import type { optionCreateDTO } from '@/DTOs/admin/option/OptionCreateDTO'
import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'
import type { OptionExtendI, OptionI, OptionsI } from '@/interfaces/admin/OptionInterface'
import httpAPI from '../httpAPI'
import type { optionUpdateDTO } from '@/DTOs/admin/option/OptionUpdateDTO'

class OptionService {
  private api = httpAPI

  async getAll(): Promise<OptionsI> {
    const res = await this.api.get<OptionsI>('/admin/options')
    console.log(res.data.message)
    return res.data
  }

  async create(data: optionCreateDTO): Promise<OptionI> {
    const res = await this.api.post<ApiListResponseI<OptionI>>('/admin/options', data)
    console.log(res.data.message)
    return res.data.data
  }

  async getById(id: string): Promise<OptionExtendI> {
    const res = await this.api.get<ApiListResponseI<OptionExtendI>>(`/admin/options/${id}`)
    console.log(res.data.message)
    return res.data.data
  }

  async update(data: optionUpdateDTO, id: string): Promise<OptionExtendI> {
    const res = await this.api.patch<ApiListResponseI<OptionExtendI>>(`/admin/options/${id}`, data)
    console.log(res.data.message)
    return res.data.data
  }
}

export default new OptionService()
