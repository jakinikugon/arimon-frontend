import type {
  BuyersMePantryDeleteResponse,
  BuyersMePantryGetResponse,
  BuyersMePantryPostRequest,
  BuyersMePantryPostResponse,
} from "@/types/api";
import type { ItemCategory, PantryItemId } from "@/types/domain";
import type { JanCode } from "@/types/utility/scalars";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getBuyersMePantry() {
  return fetcher<BuyersMePantryGetResponse>(
    backendApiUrl("/api/buyers/me/pantry"),
    {
      method: "GET",
    },
  );
}

export async function postBuyersMePantry(
  name: string,
  janCode: JanCode | null,
  category: ItemCategory,
) {
  const body: BuyersMePantryPostRequest = {
    name,
    janCode,
    category,
  };

  return fetcher<BuyersMePantryPostResponse>(
    backendApiUrl("/api/buyers/me/pantry"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

export async function deleteBuyersMePantry(pantryItemId: PantryItemId) {
  return fetcher<BuyersMePantryDeleteResponse>(
    backendApiUrl(`/api/buyers/me/pantry/${pantryItemId}`),
    {
      method: "DELETE",
    },
  );
}
