import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { StoresDetailsItemsGetResponse } from "@/types/api";
import type { UserId } from "@/types/domain";

export async function getStoresStoreIdItems(storeId: UserId) {
  return fetcher<StoresDetailsItemsGetResponse>(
    backendApiUrl(`/api/stores/${storeId}/items`),
    {
      method: "GET",
    },
  );
}
