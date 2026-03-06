import type { ItemsGetResponse } from "@/types/api";
import type { ItemCategory, SortKey } from "@/types/domain";

import { demoState } from "../_state";
import { cloneDeep, waitMockDelay } from "../_utils";

export async function getItemsConditions(
  q?: string,
  category?: ItemCategory,
  priceMin?: number,
  priceMax?: number,
  sort?: SortKey,
) {
  await waitMockDelay();

  const normalizedQ = q?.trim().toLowerCase();
  const rows = demoState.items
    .filter((item) => {
      if (normalizedQ && !item.name.toLowerCase().includes(normalizedQ)) {
        return false;
      }
      if (category && item.category !== category) {
        return false;
      }
      if (priceMin !== undefined && item.price.discount < priceMin) {
        return false;
      }
      if (priceMax !== undefined && item.price.discount > priceMax) {
        return false;
      }
      return true;
    })
    .map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
    }));

  const sorted = [...rows];
  if (sort === "price-high") {
    sorted.sort((a, b) => b.price.discount - a.price.discount);
  } else if (sort === "price-low") {
    sorted.sort((a, b) => a.price.discount - b.price.discount);
  }

  return cloneDeep(sorted) as ItemsGetResponse;
}
