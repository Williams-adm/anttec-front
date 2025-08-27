import axios, { type AxiosInstance } from "axios";
import type { categoriesI, categoryI } from "./interfaces/CategoryInterface";
import { handleApiError } from "@/utils/handleApiError";
import type { categoryCreateDTO } from "@/DTOs/admin/category/CategoryCreateDTO";

const urlApi = import.meta.env.VITE_API_URL;

class CategoryService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${urlApi}/admin/categories`,
    })
  }

  async getAll(): Promise<categoriesI> {
    try {
      const res = await this.api.get('')
      return res.data as categoriesI;
    } catch (error) {
      handleApiError(error);
    }
  }

  async getById(id: string): Promise<categoryI> {
    try {
      const res = await this.api.get(`/${id}`)
      return res.data.data as categoryI
    } catch (error) {
      handleApiError(error)
    }
  }

  async create(data: categoryCreateDTO): Promise<categoryI> {
    try {
      const res = await this.api.post('', data)
      return res.data as categoryI;
    } catch (error) {
      handleApiError(error)
    }
  }
}

export default new CategoryService();
