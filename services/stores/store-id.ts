import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { StoresDetailsGetResponse } from "@/types/api";
import type { UserId } from "@/types/domain";

export async function getStoresStoreId(storeId: UserId) {
  return fetcher<StoresDetailsGetResponse>(backendApiUrl(`/api/stores/${storeId}`), {
    method: "GET",
  });
}
