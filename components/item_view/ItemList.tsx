"use client";

import { useState } from "react";

import type {
  ItemDetailForBuyer,
  ItemId,
  ItemViewForBuyer,
} from "@/types/domain";

import { ItemCard } from "./ItemCard";
import { ItemDetailDialog } from "./ItemDetailDialog";

interface ItemListProps {
  items: ItemViewForBuyer[];
  fetchItemDetailById?: (itemId: ItemId) => Promise<ItemDetailForBuyer>;
}

export function ItemList({ items, fetchItemDetailById }: ItemListProps) {
  const [itemDetail, setItemDetail] = useState<ItemId | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-x-0.5">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={setItemDetail} />
        ))}
      </div>

      <ItemDetailDialog
        itemId={itemDetail}
        fetchItemDetailById={fetchItemDetailById}
        onOpenChange={(open) => {
          if (!open) {
            setItemDetail(null);
          }
        }}
      />
    </>
  );
}
