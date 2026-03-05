"use client";

import type { Reports } from "@/types/domain";

import { formatYen } from "@/lib/formatter";

import { Marker } from "@/components/common/Marker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function PurchaseList({ items }: { items: Reports["items"] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">購入履歴はありません。</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((history, index) => (
        <li
          key={`${history.item.id}-${history.date}-${index}`}
          className="rounded-md border px-4 py-2"
        >
          <p className="text-sm font-semibold text-gray-800">
            {history.item.name}
          </p>
          <p className="flex items-center gap-2 text-xs text-gray-600">
            <span>{formatYen(history.item.price.discount)}</span>
            <span>{formatDateTime(history.date)}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

interface PurchaseHistoryContainerProps {
  recentItems: Reports["items"];
  olderItems: Reports["items"];
  historyOpen: boolean;
  onHistoryOpenChange: (open: boolean) => void;
}

export function PurchaseHistoryContainer({
  recentItems,
  olderItems,
  historyOpen,
  onHistoryOpenChange,
}: PurchaseHistoryContainerProps) {
  return (
    <div className="space-y-4 px-5">
      <h2 className="pl-2 text-lg font-semibold text-gray-800">
        <Marker color="var(--color-brand-accent-300)">最近の購入</Marker>
      </h2>
      <PurchaseList items={recentItems} />
      {olderItems.length > 0 && (
        <Dialog open={historyOpen} onOpenChange={onHistoryOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              それ以前の購入履歴を見る
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>購入履歴（過去7日より前）</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-80 pr-3">
              <PurchaseList items={olderItems} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
