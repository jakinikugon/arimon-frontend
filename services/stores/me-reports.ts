import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { StoresMeReportsGetResponse } from "@/types/api";

export async function getStoresMeReports() {
  return fetcher<StoresMeReportsGetResponse>(
    backendApiUrl("/api/stores/me/reports"),
    {
      method: "GET",
    },
  );
}
