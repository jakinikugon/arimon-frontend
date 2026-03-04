import { HttpResponse, http } from "msw";

import type {
  StoresDetailsGetResponse,
  StoresDetailsItemsGetResponse,
  StoresMeGetResponse,
  StoresMeItemsDetailsGetResponse,
  StoresMeItemsDetailsPatchRequest,
  StoresMeItemsDetailsPatchResponse,
  StoresMeItemsGetResponse,
  StoresMeItemsPostRequest,
  StoresMeItemsPostResponse,
  StoresMePatchRequest,
  StoresMePatchResponse,
  StoresMeReportsGetResponse,
} from "@/types/api";
import type { ItemId, UserId } from "@/types/domain";

import {
  asItemViewForBuyer,
  asItemViewForStore,
  findItem,
  items,
  reports,
  storeId,
  storeProfile,
} from "./data";

export const storesHandlers = [
  http.get("*/api/stores/:storeId", ({ params }) => {
    const response: StoresDetailsGetResponse = {
      ...storeProfile,
      id: String(params.storeId ?? storeProfile.id) as UserId,
    };
    return HttpResponse.json(response);
  }),

  http.get("*/api/stores/:storeId/items", () => {
    const response: StoresDetailsItemsGetResponse = asItemViewForBuyer();
    return HttpResponse.json(response);
  }),

  http.get("*/api/stores/me", () => {
    const response: StoresMeGetResponse = {
      id: storeId,
      setting: {
        storeName: storeProfile.storeName,
        address: storeProfile.address,
        iconUrl: storeProfile.iconUrl,
        introduction: storeProfile.introduction,
      },
    };
    return HttpResponse.json(response);
  }),

  http.patch("*/api/stores/me", async ({ request }) => {
    const body = (await request.json()) as StoresMePatchRequest;
    const response: StoresMePatchResponse = {
      id: storeId,
      setting: {
        storeName: body.storeName ?? storeProfile.storeName,
        address: body.address ?? storeProfile.address,
        iconUrl: body.iconUrl ?? storeProfile.iconUrl,
        introduction: body.introduction ?? storeProfile.introduction,
      },
    };

    return HttpResponse.json(response);
  }),

  http.delete("*/api/stores/me", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/api/stores/me/reports", () => {
    const response: StoresMeReportsGetResponse = {
      totalCount: reports.totalCount,
      items: reports.items,
    };
    return HttpResponse.json(response);
  }),

  http.get("*/api/stores/me/items", () => {
    const response: StoresMeItemsGetResponse = asItemViewForStore();
    return HttpResponse.json(response);
  }),

  http.post("*/api/stores/me/items", async ({ request }) => {
    const body = (await request.json()) as Partial<StoresMeItemsPostRequest>;
    const source = items[0];
    const response: StoresMeItemsPostResponse = {
      id: "00000000-0000-4000-8000-000000000199" as ItemId,
      name: body.name ?? source.name,
      imageUrl: body.imageUrl ?? source.imageUrl,
      price: body.price ?? source.price,
      description: body.description ?? source.description,
      janCode: body.janCode ?? source.janCode,
      category: body.category ?? source.category,
      saleStart: body.saleStart ?? source.saleStart,
      saleEnd: body.saleEnd ?? source.saleEnd,
      hidden: body.hidden ?? source.hidden,
      limitDate: body.limitDate ?? source.limitDate,
    };

    return HttpResponse.json(response);
  }),

  http.get("*/api/stores/me/items/:itemId", ({ params }) => {
    const item = findItem(String(params.itemId ?? ""));
    const response: StoresMeItemsDetailsGetResponse = {
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      description: item.description,
      janCode: item.janCode,
      category: item.category,
      saleStart: item.saleStart,
      saleEnd: item.saleEnd,
      hidden: item.hidden,
      limitDate: item.limitDate,
    };

    return HttpResponse.json(response);
  }),

  http.patch("*/api/stores/me/items/:itemId", async ({ params, request }) => {
    const current = findItem(String(params.itemId ?? ""));
    const body = (await request.json()) as StoresMeItemsDetailsPatchRequest;
    const response: StoresMeItemsDetailsPatchResponse = {
      id: current.id,
      name: body.name ?? current.name,
      imageUrl: body.imageUrl ?? current.imageUrl,
      price: body.price ?? current.price,
      description: body.description ?? current.description,
      janCode: body.janCode ?? current.janCode,
      category: body.category ?? current.category,
      saleStart: body.saleStart ?? current.saleStart,
      saleEnd: body.saleEnd ?? current.saleEnd,
      hidden: body.hidden ?? current.hidden,
      limitDate: body.limitDate ?? current.limitDate,
    };

    return HttpResponse.json(response);
  }),

  http.delete("*/api/stores/me/items/:itemId", () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
