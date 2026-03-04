import type { ItemsDetailsGetResponse } from "@/types/api";
import type { ItemId } from "@/types/domain";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getItemsItemId(itemId: ItemId) {
  return fetcher<ItemsDetailsGetResponse>(
    backendApiUrl(`/api/items/${itemId}`),
    {
      method: "GET",
    },
  );
}
