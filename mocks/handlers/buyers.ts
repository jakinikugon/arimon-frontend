import { HttpResponse, http } from "msw";

import type {
  BuyersMeChatMessagesDeleteResponse,
  BuyersMeChatMessagesGetResponse,
  BuyersMeChatMessagesPostRequest,
  BuyersMeChatMessagesPostResponse,
  BuyersMeChatRecipesGetResponse,
  BuyersMeGetResponse,
  BuyersMePantryGetResponse,
  BuyersMePantryPostRequest,
  BuyersMePantryPostResponse,
  BuyersMePatchRequest,
  BuyersMePatchResponse,
  BuyersMeReportsGetResponse,
  BuyersMeReportsPostRequest,
  BuyersMeReportsPostResponse,
} from "@/types/api";
import type { PantryItemId } from "@/types/domain";

import { buyerId, chat, items, now, pantry, reports } from "./data";

export const buyersHandlers = [
  http.get("*/api/buyers/me", () => {
    const response: BuyersMeGetResponse = {
      id: buyerId,
      setting: {
        buyerName: "Demo Buyer",
        allergens: ["milk"],
        prompt: "Prefer simple Japanese recipes.",
      },
    };

    return HttpResponse.json(response);
  }),

  http.patch("*/api/buyers/me", async ({ request }) => {
    const body = (await request.json()) as BuyersMePatchRequest;
    const response: BuyersMePatchResponse = {
      id: buyerId,
      setting: {
        buyerName: body.buyerName ?? "Demo Buyer",
        allergens: body.allergens ?? ["milk"],
        prompt: body.prompt ?? "Prefer simple Japanese recipes.",
      },
    };

    return HttpResponse.json(response);
  }),

  http.delete("*/api/buyers/me", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/api/buyers/me/reports", () => {
    const response: BuyersMeReportsGetResponse = reports;
    return HttpResponse.json(response);
  }),

  http.post("*/api/buyers/me/reports", async ({ request }) => {
    const body = (await request.json()) as Partial<BuyersMeReportsPostRequest>;
    const response: BuyersMeReportsPostResponse = {
      itemId: body.itemId ?? items[0].id,
      addPantry: body.addPantry ?? false,
      reportDate: now,
    };

    return HttpResponse.json(response);
  }),

  http.get("*/api/buyers/me/pantry", () => {
    const response: BuyersMePantryGetResponse = pantry;
    return HttpResponse.json(response);
  }),

  http.post("*/api/buyers/me/pantry", async ({ request }) => {
    const body = (await request.json()) as Partial<BuyersMePantryPostRequest>;
    const response: BuyersMePantryPostResponse = {
      items: [
        ...pantry.items,
        {
          id: "00000000-0000-4000-8000-000000000299" as PantryItemId,
          name: body.name ?? "New Pantry Item",
          janCode: body.janCode ?? null,
          category: body.category ?? "other",
        },
      ],
    };

    return HttpResponse.json(response);
  }),

  http.delete("*/api/buyers/me/pantry/:pantryItemId", () => {
    const response: BuyersMePantryGetResponse = pantry;
    return HttpResponse.json(response);
  }),

  http.get("*/api/buyers/me/chat/messages", () => {
    const response: BuyersMeChatMessagesGetResponse = chat;
    return HttpResponse.json(response);
  }),

  http.post("*/api/buyers/me/chat/messages", async ({ request }) => {
    const body = (await request.json()) as BuyersMeChatMessagesPostRequest;
    const response: BuyersMeChatMessagesPostResponse = {
      messages: [
        ...chat.messages,
        {
          role: "user",
          content: body.content,
          recipes: null,
        },
      ],
    };

    return HttpResponse.json(response);
  }),

  http.delete("*/api/buyers/me/chat/messages", () => {
    const response: BuyersMeChatMessagesDeleteResponse = {
      messages: [],
    };

    return HttpResponse.json(response);
  }),

  http.get("*/api/buyers/me/chat/recipes", () => {
    const response: BuyersMeChatRecipesGetResponse =
      chat.messages[0].recipes ?? [];
    return HttpResponse.json(response);
  }),
];
