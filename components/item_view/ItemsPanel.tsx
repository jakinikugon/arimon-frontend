"use client";

import { useEffect, useState } from "react";

import type { ItemViewForBuyer } from "@/types/domain";

import { getItemsConditions } from "@/services/items";

import { SquareMove2 } from "@/components/loader";

import { ItemList } from "./ItemList";
import type { ItemSearchConditions } from "./Searchbox";
import { Searchbox } from "./Searchbox";

const DEFAULT_SEARCH_CONDITIONS: ItemSearchConditions = {
  sort: "price-low",
  priceMax: 3000,
  q: undefined,
};

const dummyItems: ItemViewForBuyer[] = [
  {
    id: "00000000-0000-4000-8000-000000000301",
    name: "いちご",
    imageUrl: "/mock/food_01.jpg",
    price: { regular: 420, discount: 420 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000302",
    name: "野菜セット",
    imageUrl: "/mock/food_02.jpg",
    price: { regular: 580, discount: 450 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000303",
    name: "パン",
    imageUrl: "/mock/food_03.jpg",
    price: { regular: 230, discount: 150 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000304",
    name: "ぶどう",
    imageUrl: "/mock/food_04.jpg",
    price: { regular: 700, discount: 520 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000305",
    name: "オレンジ",
    imageUrl: "/mock/food_05.jpg",
    price: { regular: 360, discount: 280 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000301",
    name: "いちご",
    imageUrl: "/mock/food_01.jpg",
    price: { regular: 420, discount: 420 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000302",
    name: "野菜セット",
    imageUrl: "/mock/food_02.jpg",
    price: { regular: 580, discount: 450 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000303",
    name: "パン",
    imageUrl: "/mock/food_03.jpg",
    price: { regular: 230, discount: 150 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000304",
    name: "ぶどう",
    imageUrl: "/mock/food_04.jpg",
    price: { regular: 700, discount: 520 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000305",
    name: "オレンジ",
    imageUrl: "/mock/food_05.jpg",
    price: { regular: 360, discount: 280 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000301",
    name: "いちご",
    imageUrl: "/mock/food_01.jpg",
    price: { regular: 420, discount: 420 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000302",
    name: "野菜セット",
    imageUrl: "/mock/food_02.jpg",
    price: { regular: 580, discount: 450 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000303",
    name: "パン",
    imageUrl: "/mock/food_03.jpg",
    price: { regular: 230, discount: 150 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000304",
    name: "ぶどう",
    imageUrl: "/mock/food_04.jpg",
    price: { regular: 700, discount: 520 },
  } as ItemViewForBuyer,
  {
    id: "00000000-0000-4000-8000-000000000305",
    name: "オレンジ",
    imageUrl: "/mock/food_05.jpg",
    price: { regular: 360, discount: 280 },
  } as ItemViewForBuyer,
];

export function ItemsPanel() {
  const [conditions, setConditions] = useState<ItemSearchConditions>(
    DEFAULT_SEARCH_CONDITIONS,
  );
  const [items, setItems] = useState<ItemViewForBuyer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getItemsConditions(
          conditions.q,
          undefined,
          undefined,
          conditions.priceMax,
          conditions.sort,
        );
        setItems(response);
      } catch {
        // setErrorMessage(
        //   "商品の取得に失敗しました。時間をおいて再試行してください。",
        // );
        setItems(dummyItems);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [conditions]);

  return (
    <div className="py-3">
      <Searchbox
        defaultValues={{
          q: conditions.q ?? "",
          priceMax: conditions.priceMax,
          sort: conditions.sort,
        }}
        isSubmitting={isLoading}
        onSearch={setConditions}
      />

      {errorMessage && (
        <p className="text-destructive mb-2 text-xs font-medium">
          {errorMessage}
          {JSON.stringify(conditions)}
        </p>
      )}
      {isLoading ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <SquareMove2 color="var(--color-gray-300)" size="2rem" />
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      ) : (
        <ItemList items={items} />
      )}
    </div>
  );
}
