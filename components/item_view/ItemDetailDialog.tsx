"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import type { ItemId } from "@/types/domain";
import type { ItemDetailForBuyer } from "@/types/domain";

import { formatYen } from "@/lib/formatter";

import { getItemsItemId } from "@/services/items";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemDetailDialogProps {
  itemId: ItemId | null;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function ItemDetailDialog({
  itemId,
  onOpenChange,
}: ItemDetailDialogProps) {
  const [itemDetail, setItemDetail] = useState<ItemDetailForBuyer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (itemId === null) {
      setItemDetail(null);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchItemDetail = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getItemsItemId(itemId);
        if (!isCancelled) {
          setItemDetail(response);
        }
      } catch {
        if (!isCancelled) {
          setItemDetail(null);
          setErrorMessage("商品詳細の取得に失敗しました。");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchItemDetail();

    return () => {
      isCancelled = true;
    };
  }, [itemId]);

  const hasDiscount =
    itemDetail !== null && itemDetail.price.discount < itemDetail.price.regular;

  return (
    <Dialog open={itemId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>商品詳細</DialogTitle>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : errorMessage ? (
          <p className="text-destructive text-sm">{errorMessage}</p>
        ) : itemDetail ? (
          <ScrollArea className="max-h-[70vh] pr-3">
            <div className="space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={itemDetail.imageUrl}
                  alt={itemDetail.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <p className="text-lg leading-tight font-semibold text-gray-900">
                  {itemDetail.name}
                </p>
                {hasDiscount ? (
                  <p className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      {formatYen(itemDetail.price.regular)}
                    </span>
                    <span className="text-xl font-bold text-emerald-700">
                      {formatYen(itemDetail.price.discount)}
                    </span>
                  </p>
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {formatYen(itemDetail.price.regular)}
                  </p>
                )}
              </div>

              <div className="rounded-md border p-3 text-sm">
                <p className="mb-1 text-xs text-gray-500">商品説明</p>
                <p className="whitespace-pre-wrap text-gray-800">
                  {itemDetail.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-gray-500">カテゴリ</p>
                  <p className="font-medium text-gray-900">
                    {itemDetail.category}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-gray-500">JANコード</p>
                  <p className="font-medium text-gray-900">
                    {itemDetail.janCode ?? "未設定"}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-gray-500">販売開始</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(itemDetail.saleStart)}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-gray-500">販売終了</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(itemDetail.saleEnd)}
                  </p>
                </div>
                <div className="rounded-md border p-3 sm:col-span-2">
                  <p className="text-xs text-gray-500">消費期限</p>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(itemDetail.limitDate)}
                  </p>
                </div>
              </div>

              <div className="rounded-md border p-3 text-sm">
                <p className="mb-1 text-xs text-gray-500">店舗情報</p>
                <p className="font-medium text-gray-900">
                  {itemDetail.store.storeName}
                </p>
                <p className="text-gray-700">{itemDetail.store.address}</p>
                <p className="text-gray-700">
                  救済実績: {itemDetail.store.reportsCount}件
                </p>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <p className="text-sm text-gray-500">商品詳細がありません。</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
