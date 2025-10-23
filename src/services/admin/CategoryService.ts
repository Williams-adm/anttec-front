import type { categoriesI, categoryI } from "./interfaces/CategoryInterface";
import { handleApiError } from "@/utils/handleApiError";
import type { categoryCreateDTO } from "@/DTOs/admin/category/CategoryCreateDTO";
import type { categoryUpdateDTO } from "@/DTOs/admin/category/CategoryUpdateDTO";
import httpAPI from "../httpAPI";

class CategoryService {
  private api = httpAPI;

  async getAll(): Promise<categoriesI> {
    try {
      const res = await this.api.get('/admin/categories');
      return res.data as categoriesI;
    } catch (error) {
      handleApiError(error);
    }
  }

  async getById(id: string): Promise<categoryI> {
    try {
      const res = await this.api.get(`/admin/categories/${id}`)
      return res.data.data as categoryI;
    } catch (error) {
      handleApiError(error);
    }
  }

  async create(data: categoryCreateDTO): Promise<categoryI> {
    try {
      const res = await this.api.post('/admin/categories', data)
      return res.data.data as categoryI;
    } catch (error) {
      handleApiError(error);
    }
  }

  async update(data: categoryUpdateDTO, id: string): Promise<categoryI> {
    try {
      const res = await this.api.patch(`/admin/categories/${id}`, data)
      return res.data.data as categoryI;
    } catch (error) {
      handleApiError(error);
    }
  }
}

export default new CategoryService();
