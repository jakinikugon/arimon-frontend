import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { CategoriesGetResponse } from "@/types/api";

export async function getCategories() {
  return fetcher<CategoriesGetResponse>(backendApiUrl("/api/categories"), {
    method: "GET",
  });
}
