import { useEffect, useState } from "react";

import { CalendarDays, Store, Tag } from "lucide-react";
import Image from "next/image";

import type { ItemDetailForBuyer } from "@/types/domain";
import type { ItemId } from "@/types/domain";

import { getItemsItemId } from "@/services/items";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Skeleton } from "../ui/skeleton";

type ItemDetailDialogProps = {
  itemId: ItemId | null;
  onOpenChange?: (open: boolean) => void;
};

export function ItemDetailDialog({
  itemId,
  onOpenChange,
}: ItemDetailDialogProps) {
  // const regularPrice = itemDetail.price.regular.toLocaleString();
  // const discountPrice = itemDetail.price.discount.toLocaleString();
  // const saleRange = `${new Date(itemDetail.saleStart).toLocaleDateString()} 〜 ${new Date(itemDetail.saleEnd).toLocaleDateString()}`;
  // const limitDate = new Date(itemDetail.limitDate).toLocaleDateString();

  const regularPrice = "--- IGNORE ---";
  const discountPrice = "--- IGNORE ---";
  const saleRange = "--- IGNORE ---";
  const limitDate = "--- IGNORE ---";

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

  return (
    <div className="order h-48 w-48 border-black bg-white">
      <Dialog open={itemId !== null} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-1rem)] overflow-hidden border-0 p-0 sm:w-full sm:max-w-lg">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : errorMessage ? (
            <p className="text-destructive text-sm">{errorMessage}</p>
          ) : itemDetail ? (
            <ScrollArea className="h-[84dvh] bg-white">
              <div className="space-y-4 p-4">
                <div className="ring-brand-main-200 overflow-hidden rounded-2xl bg-white ring-1">
                  <div className="p-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          aria-label="画像を拡大表示"
                          title="画像を拡大表示"
                          className="relative h-56 w-full overflow-hidden rounded-xl"
                        >
                          <Image
                            src={itemDetail.imageUrl}
                            alt={itemDetail.name}
                            fill
                            className="object-cover"
                          />
                          <span className="sr-only">画像を拡大表示</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="w-[calc(100vw-1rem)] border-0 bg-black/95 p-2 sm:max-w-3xl">
                        <DialogHeader className="sr-only">
                          <DialogTitle>
                            {itemDetail.name} の拡大画像
                          </DialogTitle>
                          <DialogDescription>
                            商品画像の全体表示です。
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative h-[80dvh] w-full">
                          <Image
                            src={itemDetail.imageUrl}
                            alt={`${itemDetail.name} 全体画像`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <DialogHeader className="from-brand-main-400 to-brand-main-600 bg-liner-to-r px-4 py-3 text-left text-white">
                    <DialogTitle className="text-2xl font-bold">
                      {itemDetail.name}
                    </DialogTitle>

                    <div className="pt-1">
                      <p className="text-[11px] text-white/70">Price</p>
                      <div className="mt-1 flex items-end gap-3">
                        <p className="text-3xl font-bold">{discountPrice}円</p>
                        <p className="pb-1 text-sm text-white/60 line-through">
                          {regularPrice}円
                        </p>
                      </div>

                      <hr className="pt-4" />

                      <DialogDescription className="text-xs text-white/75">
                        {itemDetail.description}
                      </DialogDescription>
                    </div>
                  </DialogHeader>
                </div>

                <div className="ring-brand-main-200 rounded-xl bg-white p-3 ring-1">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-8 text-sm">
                    <div>
                      <div className="w-full">
                        <p className="text-brand-main-600 mb-1 flex w-full items-center justify-start gap-2 text-left text-xs">
                          <Tag className="text-brand-accent-600 h-4 w-4" />
                          カテゴリー
                        </p>
                        <p className="text-brand-main-900 text-center font-semibold">
                          {itemDetail.category}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="w-full">
                        <p className="text-brand-main-600 mb-1 flex w-full items-center justify-start gap-2 text-left text-xs">
                          <CalendarDays className="text-brand-accent-600 h-4 w-4" />
                          販売期間
                        </p>
                        <p className="text-brand-main-900 text-center font-semibold">
                          {saleRange}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="w-full">
                        <p className="text-brand-main-600 mb-1 flex w-full items-center justify-start gap-2 text-left text-xs">
                          <Store className="text-brand-accent-600 h-4 w-4" />
                          販売店舗
                        </p>
                        <p className="text-brand-main-900 text-center font-semibold">
                          {itemDetail.store.storeName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="w-full">
                        <p className="text-brand-main-600 mb-1 flex w-full items-center justify-start gap-2 text-left text-xs">
                          <CalendarDays className="text-brand-accent-600 h-4 w-4" />
                          賞味期限
                        </p>
                        <p className="text-brand-main-900 text-center font-semibold">
                          {limitDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-gray-500">商品詳細がありません。</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
