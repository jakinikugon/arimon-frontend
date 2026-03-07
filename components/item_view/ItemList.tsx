"use client";

import { useState } from "react";

import type { ItemId, ItemViewForBuyer } from "@/types/domain";

import { ItemCard } from "./ItemCard";
import { ItemDetailDialog } from "./ItemDetailDialog";

interface ItemListProps {
  items: ItemViewForBuyer[];
}

export function ItemList({ items }: ItemListProps) {
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
        onOpenChange={(open) => {
          if (!open) {
            setItemDetail(null);
          }
        }}
      />
    </>
  );
}
