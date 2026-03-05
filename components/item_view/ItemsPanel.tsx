"use client";

import { useEffect, useMemo, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ItemViewForBuyer } from "@/types/domain";

import { getItemsConditions } from "@/services/items";

import { SquareMove2 } from "@/components/loader";

import { ItemList } from "./ItemList";
import type { ItemSearchConditions } from "./Searchbox";
import { Searchbox } from "./Searchbox";

const DEFAULT_PRICE_MAX = 3000;

function parseSort(raw: string | null): ItemSearchConditions["sort"] {
  return raw === "price-high" ? "price-high" : "price-low";
}

function parsePriceMax(raw: string | null): number {
  if (!raw) return DEFAULT_PRICE_MAX;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return DEFAULT_PRICE_MAX;
  return Math.max(0, Math.floor(parsed));
}

function parseConditionsFromSearchParams(
  searchParams: URLSearchParams,
): ItemSearchConditions {
  const q = searchParams.get("q")?.trim();

  return {
    q: q ? q : undefined,
    priceMax: parsePriceMax(searchParams.get("price_max")),
    sort: parseSort(searchParams.get("sort")),
  };
}

function isSameConditions(
  left: ItemSearchConditions,
  right: ItemSearchConditions,
): boolean {
  return (
    left.q === right.q &&
    left.priceMax === right.priceMax &&
    left.sort === right.sort
  );
}

export function ItemsPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedConditions = useMemo(
    () => parseConditionsFromSearchParams(searchParams),
    [searchParams],
  );
  const [conditions, setConditions] =
    useState<ItemSearchConditions>(parsedConditions);
  const [items, setItems] = useState<ItemViewForBuyer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setConditions((prev) =>
      isSameConditions(prev, parsedConditions) ? prev : parsedConditions,
    );
  }, [parsedConditions]);

  const handleSearch = (nextConditions: ItemSearchConditions) => {
    setConditions(nextConditions);

    const nextParams = new URLSearchParams();
    if (nextConditions.q !== undefined) {
      nextParams.set("q", nextConditions.q);
    }
    if (nextConditions.priceMax !== undefined) {
      nextParams.set("price_max", String(nextConditions.priceMax));
    }
    nextParams.set("sort", nextConditions.sort);

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

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
        onSearch={handleSearch}
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
