import type {
  StoresMeDeleteResponse,
  StoresMeGetResponse,
  StoresMePatchRequest,
  StoresMePatchResponse,
} from "@/types/api";
import type {
  StoreAddress,
  StoreIconUrl,
  StoreIntroduction,
  StoreName,
} from "@/types/domain";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getStoresMe() {
  return fetcher<StoresMeGetResponse>(backendApiUrl("/api/stores/me"), {
    method: "GET",
  });
}

export async function patchStoresMe(
  storeName?: StoreName,
  address?: StoreAddress,
  iconUrl?: StoreIconUrl,
  introduction?: StoreIntroduction,
) {
  const body: StoresMePatchRequest = {};

  if (storeName !== undefined) body.storeName = storeName;
  if (address !== undefined) body.address = address;
  if (iconUrl !== undefined) body.iconUrl = iconUrl;
  if (introduction !== undefined) body.introduction = introduction;

  return fetcher<StoresMePatchResponse>(backendApiUrl("/api/stores/me"), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function deleteStoresMe() {
  return fetcher<StoresMeDeleteResponse>(backendApiUrl("/api/stores/me"), {
    method: "DELETE",
  });
}
