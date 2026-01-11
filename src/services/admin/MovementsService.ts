import type { movementCreateDTO } from '@/DTOs/admin/movement/MovementCreateDTO'
import type { ApiListResponseI } from '@/interfaces/admin/base/ApiListResponseInterface'
import type { movementI } from '@/interfaces/admin/movement/MovementInterface'
import type { movementsShortI } from '@/interfaces/admin/movement/MovementShortInterface'
import httpAdmin from '../httpAdmin'

class MovementsService {
  private api = httpAdmin

  async getAll(): Promise<movementsShortI> {
    const res = await this.api.get<movementsShortI>('/admin/movements')
    console.log(res.data.message)
    return res.data
  }

  async create(data: movementCreateDTO): Promise<movementI> {
    const res = await this.api.post<ApiListResponseI<movementI>>('/admin/movements', data)
    console.log(res.data.message)
    return res.data.data
  }

  async getById(id: string | number): Promise<movementI> {
    const res = await this.api.get<ApiListResponseI<movementI>>(`/admin/movements/${id}`)
    console.log(res.data.message)
    return res.data.data
  }
}

export default new MovementsService()
