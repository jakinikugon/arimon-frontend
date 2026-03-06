import type {
  BuyersMeReportsGetResponse,
  BuyersMeReportsPostResponse,
} from "@/types/api";
import type { ItemId, PantryItemId } from "@/types/domain";

import { demoState } from "../_state";
import { cloneDeep, nowTimestamp, waitMockDelay } from "../_utils";

export async function getBuyersMeReports() {
  await waitMockDelay();
  return cloneDeep(demoState.reports) as BuyersMeReportsGetResponse;
}

export async function postBuyersMeReports(itemId: ItemId, addPantry: boolean) {
  await waitMockDelay(200);

  const item = demoState.items.find((row) => row.id === itemId);
  if (!item) {
    throw new Error(`Item not found: ${itemId}`);
  }

  demoState.reports.items.unshift({
    item: {
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
    },
    date: nowTimestamp(),
  });
  demoState.reports.totalCount = demoState.reports.items.length;
  demoState.reports.totalDiscount += item.price.regular - item.price.discount;

  if (addPantry) {
    demoState.pantryIdSequence += 1;
    demoState.pantry.items.unshift({
      id: `08ea4a8d-e730-4dff-8ec0-${String(demoState.pantryIdSequence).padStart(12, "0")}` as PantryItemId,
      name: item.name,
      janCode: item.janCode,
      category: item.category,
    });
  }

  return {
    itemId,
    addPantry,
    reportDate: demoState.reports.items[0].date,
  } as BuyersMeReportsPostResponse;
}
