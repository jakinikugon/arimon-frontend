import type { StoresMeReportsGetResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getStoresMeReports() {
  return fetcher<StoresMeReportsGetResponse>(
    backendApiUrl("/api/stores/me/reports"),
    {
      method: "GET",
    },
  );
}
