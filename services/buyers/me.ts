import type {
  BuyersMeDeleteResponse,
  BuyersMeGetResponse,
  BuyersMePatchRequest,
  BuyersMePatchResponse,
} from "@/types/api";
import type { Allergen, BuyerName } from "@/types/domain";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getBuyersMe() {
  return fetcher<BuyersMeGetResponse>(backendApiUrl("/api/buyers/me"), {
    method: "GET",
  });
}

export async function patchBuyersMe(
  buyerName?: BuyerName,
  allergens?: Allergen[],
  prompt?: string,
) {
  const body: BuyersMePatchRequest = {};

  if (buyerName !== undefined) body.buyerName = buyerName;
  if (allergens !== undefined) body.allergens = allergens;
  if (prompt !== undefined) body.prompt = prompt;

  return fetcher<BuyersMePatchResponse>(backendApiUrl("/api/buyers/me"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function deleteBuyersMe() {
  return fetcher<BuyersMeDeleteResponse>(backendApiUrl("/api/buyers/me"), {
    method: "DELETE",
  });
}
