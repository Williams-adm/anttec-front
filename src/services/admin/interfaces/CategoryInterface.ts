import type { paginatedResponseI} from "./PaginationInterface";

export interface categoryI {
  id: number,
  name: string,
  status: boolean,
};

export type categoriesI = paginatedResponseI<categoryI>;
