import type { CategoriesGetResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getCategories() {
  return fetcher<CategoriesGetResponse>(backendApiUrl("/api/categories"), {
    method: "GET",
  });
}
