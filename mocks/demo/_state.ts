import type {
  Buyer,
  ItemDetailForBuyer,
  Pantry,
  Reports,
} from "@/types/domain";
import type { Chat, Recipe } from "@/types/domain";
import type { ItemId, PantryItemId, UserId } from "@/types/domain";
import type { JanCode, URL } from "@/types/utility/scalars";

import { asTimestamp } from "./_utils";

const BUYER_ID = "5f7b0f2c-9c80-43b6-9a44-7756142f7800" as UserId;
const STORE_ID = "9d93b68b-a536-4c89-b940-0eef3be980a4" as UserId;

const itemCatalog: ItemDetailForBuyer[] = [
  {
    id: "87a8e462-fd5d-4b2f-8a3e-2095475a9d21" as ItemId,
    name: "産直トマト 4個パック",
    imageUrl:
      "https://images.unsplash.com/photo-1546470427-e5ac89cd0b5b" as URL,
    price: {
      regular: 398,
      discount: 248,
    },
    description:
      "契約農家から仕入れた完熟トマトです。サラダやパスタに使いやすいサイズです。",
    store: {
      id: STORE_ID,
      storeName: "Midori Foods Kanda",
      address: "東京都千代田区神田錦町2-3-18",
      iconUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4" as URL,
      introduction:
        "地元食材を中心に、当日中に使いやすい商品をお手頃価格で提供しています。",
      reportsCount: 184,
    },
    janCode: "4901777304518" as JanCode,
    category: "vegetable",
    saleStart: asTimestamp("2026-03-05T00:00:00.000Z"),
    saleEnd: asTimestamp("2026-03-10T11:30:00.000Z"),
    limitDate: asTimestamp("2026-03-11T00:00:00.000Z"),
  },
  {
    id: "5e9158de-f2bb-443d-b64e-c4ba11b2d4d7" as ItemId,
    name: "全粒粉ロール 6個入り",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff" as URL,
    price: {
      regular: 320,
      discount: 220,
    },
    description:
      "朝食にもおやつにも使いやすい全粒粉ロールです。軽く温めると香りが立ちます。",
    store: {
      id: STORE_ID,
      storeName: "Midori Foods Kanda",
      address: "東京都千代田区神田錦町2-3-18",
      iconUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4" as URL,
      introduction:
        "地元食材を中心に、当日中に使いやすい商品をお手頃価格で提供しています。",
      reportsCount: 184,
    },
    janCode: "4902777321450" as JanCode,
    category: "bread",
    saleStart: asTimestamp("2026-03-05T00:00:00.000Z"),
    saleEnd: asTimestamp("2026-03-11T12:00:00.000Z"),
    limitDate: asTimestamp("2026-03-11T00:00:00.000Z"),
  },
  {
    id: "6e8a9708-8cb3-4172-a921-8cc57c822884" as ItemId,
    name: "青森りんご 3玉",
    imageUrl:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce" as URL,
    price: {
      regular: 498,
      discount: 348,
    },
    description:
      "食感の良い青森県産りんごです。皮ごと食べやすいよう丁寧に選別しています。",
    store: {
      id: STORE_ID,
      storeName: "Midori Foods Kanda",
      address: "東京都千代田区神田錦町2-3-18",
      iconUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4" as URL,
      introduction:
        "地元食材を中心に、当日中に使いやすい商品をお手頃価格で提供しています。",
      reportsCount: 184,
    },
    janCode: "4903777350098" as JanCode,
    category: "fruit",
    saleStart: asTimestamp("2026-03-05T00:00:00.000Z"),
    saleEnd: asTimestamp("2026-03-12T10:00:00.000Z"),
    limitDate: asTimestamp("2026-03-13T00:00:00.000Z"),
  },
  {
    id: "6fd4ae50-8bdb-4b1a-84af-b4e413f881e3" as ItemId,
    name: "豆乳ヨーグルト 400g",
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777" as URL,
    price: {
      regular: 278,
      discount: 198,
    },
    description:
      "植物性原料で作った豆乳ヨーグルトです。朝食やデザートに使いやすい味わいです。",
    store: {
      id: STORE_ID,
      storeName: "Midori Foods Kanda",
      address: "東京都千代田区神田錦町2-3-18",
      iconUrl:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4" as URL,
      introduction:
        "地元食材を中心に、当日中に使いやすい商品をお手頃価格で提供しています。",
      reportsCount: 184,
    },
    janCode: "4904777310201" as JanCode,
    category: "dairy",
    saleStart: asTimestamp("2026-03-05T00:00:00.000Z"),
    saleEnd: asTimestamp("2026-03-09T11:00:00.000Z"),
    limitDate: asTimestamp("2026-03-10T00:00:00.000Z"),
  },
];

const initialRecipes: Recipe[] = [
  {
    title: "トマトとロールパンのワンプレート",
    description: "トマトを切ってロールパンに添えるだけの時短プレートです。",
    materials: [
      {
        name: "産直トマト 4個パック",
        query: "トマト",
        inPantry: true,
      },
      {
        name: "全粒粉ロール 6個入り",
        query: "ロールパン",
        inPantry: false,
      },
    ],
  },
];

export const demoState: {
  buyer: Buyer;
  items: ItemDetailForBuyer[];
  pantry: Pantry;
  reports: Reports;
  chat: Chat;
  pantryIdSequence: number;
} = {
  buyer: {
    id: BUYER_ID,
    setting: {
      buyerName: "Natsuki Sato",
      allergens: ["egg", "milk"],
      prompt:
        "平日の夕食を30分以内で作れる提案を優先し、子どもでも食べやすい味付けにしてください。",
    },
  },
  items: itemCatalog,
  pantry: {
    items: [
      {
        id: "f2634cc7-b8d1-4f51-a3a1-608f6b75f4a1" as PantryItemId,
        name: "玉ねぎ",
        janCode: null,
        category: "vegetable",
      },
      {
        id: "25a1e97e-4fa6-4bd6-a0f0-b2804f7d3b8f" as PantryItemId,
        name: "卵 6個",
        janCode: "4901777012458" as JanCode,
        category: "dairy",
      },
    ],
  },
  reports: {
    totalCount: 2,
    totalDiscount: 250,
    items: [
      {
        item: {
          id: itemCatalog[0].id,
          name: itemCatalog[0].name,
          imageUrl: itemCatalog[0].imageUrl,
          price: itemCatalog[0].price,
        },
        date: asTimestamp("2026-03-05T09:15:00.000Z"),
      },
      {
        item: {
          id: itemCatalog[1].id,
          name: itemCatalog[1].name,
          imageUrl: itemCatalog[1].imageUrl,
          price: itemCatalog[1].price,
        },
        date: asTimestamp("2026-03-04T11:40:00.000Z"),
      },
    ],
  },
  chat: {
    messages: [
      {
        role: "assistant",
        content:
          "今日の在庫なら、トマトとパンを使った軽食メニューが短時間で作れます。",
        recipes: initialRecipes,
      },
      {
        role: "user",
        content: "仕事後でもすぐ作れるメニューを提案して",
        recipes: null,
      },
    ],
  },
  pantryIdSequence: 3000,
};
