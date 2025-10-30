import type { loginDTO } from '@/DTOs/auth/LoginDTO'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { loginI } from './interface/LoginInterface'
import { handleApiError } from '@/utils/handleApiError'
import { useAuthStore } from '@/stores/useAuthStore'

const urlApi = import.meta.env.VITE_API_URL

class AuthService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${urlApi}/auth`,
    })
  }

  async login(data: loginDTO): Promise<loginI> {
    try {
      const res = await this.api.post('/login', data)
      const token = res.data.token

      const authStore = useAuthStore()
      authStore.setToken(token)
      authStore.setUser(res.data.user)

      return res.data as loginI
    } catch (error) {
      handleApiError(error)
    }
  }
}

export default new AuthService()
