import type {
  BuyersMeChatMessagesGetResponse,
  BuyersMePantryGetResponse,
  BuyersMeReportsGetResponse,
  ItemsGetResponse,
  StoresDetailsGetResponse,
  StoresMeItemsDetailsGetResponse,
  StoresMeItemsGetResponse,
} from "@/types/api";
import type { ItemId, PantryItemId, UserId } from "@/types/domain";
import type { JanCode, Timestamp, URL } from "@/types/utility/scalars";

export const now = "2026-03-05T00:00:00.000Z" as Timestamp;

export const buyerId = "00000000-0000-4000-8000-000000000001" as UserId;
export const storeId = "00000000-0000-4000-8000-000000000002" as UserId;

export const storeProfile: StoresDetailsGetResponse = {
  id: storeId,
  storeName: "Arimon Market",
  address: "Tokyo, Chiyoda",
  iconUrl: "https://example.com/store/icon.png",
  introduction: "Fresh daily deals",
  reportsCount: 12,
};

export const items: StoresMeItemsDetailsGetResponse[] = [
  {
    id: "00000000-0000-4000-8000-000000000101" as ItemId,
    name: "Discount Tomato",
    imageUrl: "https://example.com/items/tomato.png" as URL,
    price: {
      regular: 280,
      discount: 180,
    },
    description: "Ripe and sweet tomatoes.",
    janCode: "4901234567890" as JanCode,
    category: "vegetable",
    saleStart: now,
    saleEnd: "2026-03-10T00:00:00.000Z" as Timestamp,
    limitDate: "2026-03-08T00:00:00.000Z" as Timestamp,
    hidden: false,
  },
  {
    id: "00000000-0000-4000-8000-000000000102" as ItemId,
    name: "Fresh Milk",
    imageUrl: "https://example.com/items/milk.png" as URL,
    price: {
      regular: 220,
      discount: 160,
    },
    description: "1L milk pack",
    janCode: "4901234567891" as JanCode,
    category: "dairy",
    saleStart: now,
    saleEnd: "2026-03-12T00:00:00.000Z" as Timestamp,
    limitDate: "2026-03-09T00:00:00.000Z" as Timestamp,
    hidden: false,
  },
];

export const pantry: BuyersMePantryGetResponse = {
  items: [
    {
      id: "00000000-0000-4000-8000-000000000201" as PantryItemId,
      name: "Onion",
      janCode: null,
      category: "vegetable",
    },
  ],
};

export const chat: BuyersMeChatMessagesGetResponse = {
  messages: [
    {
      role: "assistant",
      content: "Tomato pasta is a good option.",
      recipes: [
        {
          title: "Quick Tomato Pasta",
          description: "Simple pasta recipe.",
          materials: [
            {
              name: "Tomato",
              query: "tomato",
              inPantry: true,
            },
            {
              name: "Pasta",
              query: "pasta",
              inPantry: false,
            },
          ],
        },
      ],
    },
    {
      role: "user",
      content: "Any easy dinner ideas?",
      recipes: null,
    },
  ],
};

export const reports: BuyersMeReportsGetResponse = {
  totalCount: 3,
  totalDiscount: 250,
  items: [
    {
      item: {
        id: items[0].id,
        name: items[0].name,
        imageUrl: items[0].imageUrl,
        price: items[0].price,
      },
      date: now,
    },
  ],
};

export function asItemViewForBuyer(): ItemsGetResponse {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    price: item.price,
  }));
}

export function asItemViewForStore(): StoresMeItemsGetResponse {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    price: item.price,
    hidden: item.hidden,
  }));
}

export function findItem(itemId: string): StoresMeItemsDetailsGetResponse {
  return items.find((item) => item.id === itemId) ?? items[0];
}
