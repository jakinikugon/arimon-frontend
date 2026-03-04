import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { ItemsGetResponse } from "@/types/api";
import type { ItemCategory, SortKey } from "@/types/domain";
import { queryString } from "@/utils/url";

export async function getItemsConditions(
  q?: string,
  category?: ItemCategory,
  priceMin?: number,
  priceMax?: number,
  sort?: SortKey,
) {
  const query: Record<string, string> = {};

  if (q !== undefined) query.q = q;
  if (category !== undefined) query.category = category;
  if (priceMin !== undefined) query.price_min = String(priceMin);
  if (priceMax !== undefined) query.price_max = String(priceMax);
  if (sort !== undefined) query.sort = sort;

  const path =
    Object.keys(query).length > 0 ? queryString("/api/items", query) : "/api/items";

  return fetcher<ItemsGetResponse>(backendApiUrl(path), {
    method: "GET",
  });
}
