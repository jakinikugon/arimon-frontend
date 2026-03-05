"use client";

import type { ItemId } from "@/types/domain";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ItemDetailDialogProps {
  itemId: ItemId | null;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailDialog({
  itemId,
  onOpenChange,
}: ItemDetailDialogProps) {
  return (
    <Dialog open={itemId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="h-40 sm:max-w-md">
        <DialogTitle>商品詳細（仮）</DialogTitle>
        <p>商品ID: {itemId}</p>
        <p>ここに商品詳細の内容が入ります。</p>
      </DialogContent>
    </Dialog>
  );
}
