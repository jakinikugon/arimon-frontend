import type {
  BuyersMePantryDeleteResponse,
  BuyersMePantryGetResponse,
  BuyersMePantryPostResponse,
} from "@/types/api";
import type { ItemCategory, PantryItemId } from "@/types/domain";
import type { JanCode } from "@/types/utility/scalars";

import { demoState } from "../_state";
import { cloneDeep, waitMockDelay } from "../_utils";

export async function getBuyersMePantry() {
  await waitMockDelay();
  return cloneDeep(demoState.pantry) as BuyersMePantryGetResponse;
}

export async function postBuyersMePantry(
  name: string,
  janCode: JanCode | null,
  category: ItemCategory,
) {
  await waitMockDelay(200);

  demoState.pantryIdSequence += 1;
  demoState.pantry.items.unshift({
    id: `08ea4a8d-e730-4dff-8ec0-${String(demoState.pantryIdSequence).padStart(12, "0")}` as PantryItemId,
    name,
    janCode,
    category,
  });

  return cloneDeep(demoState.pantry) as BuyersMePantryPostResponse;
}

export async function deleteBuyersMePantry(pantryItemId: PantryItemId) {
  await waitMockDelay(170);

  demoState.pantry.items = demoState.pantry.items.filter(
    (row) => row.id !== pantryItemId,
  );

  return cloneDeep(demoState.pantry) as BuyersMePantryDeleteResponse;
}
