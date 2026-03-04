import type { StoresDetailsItemsGetResponse } from "@/types/api";
import type { UserId } from "@/types/domain";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getStoresStoreIdItems(storeId: UserId) {
  return fetcher<StoresDetailsItemsGetResponse>(
    backendApiUrl(`/api/stores/${storeId}/items`),
    {
      method: "GET",
    },
  );
}
