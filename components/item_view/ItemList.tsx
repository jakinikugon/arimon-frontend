"use client";

import { useState } from "react";

import type { ItemId, ItemViewForBuyer } from "@/types/domain";

import { ItemCardForBuyer } from "./ItemCard";
import { ItemDetailDialog } from "./ItemDetailDialog";

interface ItemListForBuyerProps {
  items: ItemViewForBuyer[];
}

export function ItemListForBuyer({ items }: ItemListForBuyerProps) {
  const [itemDetail, setItemDetail] = useState<ItemId | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-x-0.5">
        {items.map((item) => (
          <ItemCardForBuyer key={item.id} item={item} onClick={setItemDetail} />
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
