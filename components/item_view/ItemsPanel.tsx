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
        setErrorMessage(
          "商品の取得に失敗しました。時間をおいて再試行してください。",
        );
        setItems([]);
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
