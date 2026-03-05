"use client";

import Image from "next/image";

import type { ItemId, ItemViewForBuyer } from "@/types/domain";

import { formatYen } from "@/lib/formatter";

interface ItemCardForBuyerProps {
  item: ItemViewForBuyer;
  onClick: (itemId: ItemId) => void;
}

export function ItemCardForBuyer({ item, onClick }: ItemCardForBuyerProps) {
  const hasDiscount = item.price.discount < item.price.regular;

  return (
    <button
      type="button"
      onClick={() => onClick(item.id)}
      className="group flex w-full flex-col text-left"
    >
      <div className="relative aspect-square w-full bg-gray-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="33vw"
          className="object-cover transition group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-black/30 px-2 py-0.5">
          {hasDiscount ? (
            <p className="flex items-baseline gap-2">
              <span className="text-xs text-white/80 line-through">
                {formatYen(item.price.regular)}
              </span>
              <span className="text-sm font-bold text-yellow-200">
                {formatYen(item.price.discount)}
              </span>
            </p>
          ) : (
            <p className="text-sm font-bold text-white">
              {formatYen(item.price.regular)}
            </p>
          )}
        </div>
      </div>
      <div className="bg-white px-2 py-1">
        <p className="h-8 overflow-hidden text-xs leading-snug font-medium text-black">
          {item.name}
        </p>
      </div>
    </button>
  );
}
