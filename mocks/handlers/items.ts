import { HttpResponse, http } from "msw";

import type { ItemsDetailsGetResponse, ItemsGetResponse } from "@/types/api";

import { asItemViewForBuyer, findItem, storeProfile } from "./data";

export const itemsHandlers = [
  http.get("*/api/items", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const category = url.searchParams.get("category");

    const response: ItemsGetResponse = asItemViewForBuyer().filter((item) => {
      const matchQ = q ? item.name.toLowerCase().includes(q) : true;
      const source = findItem(item.id);
      const matchCategory = category ? source.category === category : true;
      return matchQ && matchCategory;
    });

    return HttpResponse.json(response);
  }),

  http.get("*/api/items/:itemId", ({ params }) => {
    const item = findItem(String(params.itemId ?? ""));
    const response: ItemsDetailsGetResponse = {
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      description: item.description,
      store: storeProfile,
      janCode: item.janCode,
      category: item.category,
      saleStart: item.saleStart,
      saleEnd: item.saleEnd,
      limitDate: item.limitDate,
    };

    return HttpResponse.json(response);
  }),
];
