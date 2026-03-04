import type {
  BuyersMeReportsGetResponse,
  BuyersMeReportsPostRequest,
  BuyersMeReportsPostResponse,
} from "@/types/api";
import type { ItemId } from "@/types/domain";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getBuyersMeReports() {
  return fetcher<BuyersMeReportsGetResponse>(
    backendApiUrl("/api/buyers/me/reports"),
    {
      method: "GET",
    },
  );
}

export async function postBuyersMeReports(itemId: ItemId, addPantry: boolean) {
  const body: BuyersMeReportsPostRequest = {
    itemId,
    addPantry,
  };

  return fetcher<BuyersMeReportsPostResponse>(
    backendApiUrl("/api/buyers/me/reports"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}
