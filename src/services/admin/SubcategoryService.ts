import type { subcategoryUpdateDTO } from "@/DTOs/admin/subcategory/SubcategoryUpdateDTO";
import httpAPI from "../httpAPI";
import type { subcategoriesI, subcategoryI } from "./interfaces/SubcategoryInterface";

class SubcategoryService {
  private api = httpAPI;

  async getAll(): Promise<subcategoriesI> {
    const res = await this.api.get('/admin/subcategories');
    console.log(res.data.message);
    return res.data as subcategoriesI
  }

  async update(data: subcategoryUpdateDTO, id: string): Promise<subcategoryI> {
    const res = await this.api.patch(`/admin/subcategories/${id}`, data);
    console.log(res.data.message);
    return res.data.data as subcategoryI
  }
}

export default new SubcategoryService()

