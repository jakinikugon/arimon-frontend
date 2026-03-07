import { CalendarDays, Store, Tag } from "lucide-react";
import Image from "next/image";

import type { ItemDetailForBuyer } from "@/types/domain";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type DetailCardProps = {
  item: ItemDetailForBuyer;
  onOpenChange?: (open: boolean) => void;
};

export function DetailCard({ item }: DetailCardProps) {
  const regularPrice = item.price.regular.toLocaleString();
  const discountPrice = item.price.discount.toLocaleString();
  const saleRange = `${new Date(item.saleStart).toLocaleDateString()} 〜 ${new Date(item.saleEnd).toLocaleDateString()}`;
  const limitDate = new Date(item.limitDate).toLocaleDateString();

  return (
    <div className="order h-48 w-48 border-black bg-white">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group ring-brand-main-200 bg-brand-main-50 hover:ring-brand-main-300 w-full overflow-hidden rounded-xl p-2 text-left ring-1 transition"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={120}
              height={120}
              className="w-full rounded-lg bg-white object-cover"
            />
            <p className="text-brand-main-900 mt-2 line-clamp-1 text-left text-sm font-semibold">
              {item.name}
            </p>
            <p className="text-brand-main-700 text-xs">{discountPrice}円</p>
          </button>
        </DialogTrigger>

        <DialogContent className="w-[calc(100vw-1rem)] overflow-hidden border-0 p-0 sm:w-full sm:max-w-lg">
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
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <span className="sr-only">画像を拡大表示</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-[calc(100vw-1rem)] border-0 bg-black/95 p-2 sm:max-w-3xl">
                      <DialogHeader className="sr-only">
                        <DialogTitle>{item.name} の拡大画像</DialogTitle>
                        <DialogDescription>
                          商品画像の全体表示です。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative h-[80dvh] w-full">
                        <Image
                          src={item.imageUrl}
                          alt={`${item.name} 全体画像`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <DialogHeader className="from-brand-main-400 to-brand-main-600 bg-liner-to-r px-4 py-3 text-left text-white">
                  <DialogTitle className="text-2xl font-bold">
                    {item.name}
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
                      {item.description}
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
                        {item.category}
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
                        {item.store.storeName}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
