import type {
  StoresMeItemsGetResponse,
  StoresMeItemsPostRequest,
  StoresMeItemsPostResponse,
} from "@/types/api";
import type { ItemCategory } from "@/types/domain";
import type { JanCode, Timestamp, URL } from "@/types/utility/scalars";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getStoresMeItems() {
  return fetcher<StoresMeItemsGetResponse>(
    backendApiUrl("/api/stores/me/items"),
    {
      method: "GET",
    },
  );
}

export async function postStoresMeItems(
  name: string,
  imageUrl: URL,
  regularPrice: number,
  discountPrice: number,
  description: string,
  janCode: JanCode | null,
  category: ItemCategory,
  saleStart: Timestamp,
  saleEnd: Timestamp,
  hidden: boolean,
  limitDate: Timestamp,
) {
  const body: StoresMeItemsPostRequest = {
    name,
    imageUrl,
    price: {
      regular: regularPrice,
      discount: discountPrice,
    },
    description,
    janCode,
    category,
    saleStart,
    saleEnd,
    hidden,
    limitDate,
  };

  return fetcher<StoresMeItemsPostResponse>(
    backendApiUrl("/api/stores/me/items"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}
