import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type {
  StoresMeItemsDetailsDeleteResponse,
  StoresMeItemsDetailsGetResponse,
  StoresMeItemsDetailsPatchRequest,
  StoresMeItemsDetailsPatchResponse,
} from "@/types/api";
import type { ItemCategory, ItemId } from "@/types/domain";
import type { JanCode, Timestamp, URL } from "@/types/utility/scalars";

export async function getStoresMeItemsItemId(itemId: ItemId) {
  return fetcher<StoresMeItemsDetailsGetResponse>(
    backendApiUrl(`/api/stores/me/items/${itemId}`),
    {
      method: "GET",
    },
  );
}

export async function patchStoresMeItemsItemId(
  itemId: ItemId,
  name?: string,
  imageUrl?: URL,
  regularPrice?: number,
  discountPrice?: number,
  description?: string,
  janCode?: JanCode | null,
  category?: ItemCategory,
  saleStart?: Timestamp,
  saleEnd?: Timestamp,
  hidden?: boolean,
  limitDate?: Timestamp,
) {
  const body: StoresMeItemsDetailsPatchRequest = {};

  if (name !== undefined) body.name = name;
  if (imageUrl !== undefined) body.imageUrl = imageUrl;
  if (description !== undefined) body.description = description;
  if (janCode !== undefined) body.janCode = janCode;
  if (category !== undefined) body.category = category;
  if (saleStart !== undefined) body.saleStart = saleStart;
  if (saleEnd !== undefined) body.saleEnd = saleEnd;
  if (hidden !== undefined) body.hidden = hidden;
  if (limitDate !== undefined) body.limitDate = limitDate;

  if (regularPrice !== undefined || discountPrice !== undefined) {
    if (regularPrice === undefined || discountPrice === undefined) {
      throw new Error(
        "regularPrice and discountPrice must both be provided when updating price.",
      );
    }

    body.price = {
      regular: regularPrice,
      discount: discountPrice,
    };
  }

  return fetcher<StoresMeItemsDetailsPatchResponse>(
    backendApiUrl(`/api/stores/me/items/${itemId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

export async function deleteStoresMeItemsItemId(itemId: ItemId) {
  return fetcher<StoresMeItemsDetailsDeleteResponse>(
    backendApiUrl(`/api/stores/me/items/${itemId}`),
    {
      method: "DELETE",
    },
  );
}
