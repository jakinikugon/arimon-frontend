import type { ItemsDetailsGetResponse } from "@/types/api";
import type { ItemId } from "@/types/domain";

import { demoState } from "../_state";
import { cloneDeep, waitMockDelay } from "../_utils";

export async function getItemsItemId(itemId: ItemId) {
  await waitMockDelay(180);

  const item = demoState.items.find((row) => row.id === itemId);
  if (!item) {
    throw new Error(`Item not found: ${itemId}`);
  }

  return cloneDeep(item) as ItemsDetailsGetResponse;
}
