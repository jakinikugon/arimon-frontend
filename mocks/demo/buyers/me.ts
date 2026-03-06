import type {
  BuyersMeDeleteResponse,
  BuyersMeGetResponse,
  BuyersMePatchResponse,
} from "@/types/api";
import type { Allergen, BuyerName } from "@/types/domain";

import { demoState } from "../_state";
import { cloneDeep, waitMockDelay } from "../_utils";

export async function getBuyersMe() {
  await waitMockDelay();
  return cloneDeep(demoState.buyer) as BuyersMeGetResponse;
}

export async function patchBuyersMe(
  buyerName?: BuyerName,
  allergens?: Allergen[],
  prompt?: string,
) {
  await waitMockDelay(220);

  if (buyerName !== undefined) {
    demoState.buyer.setting.buyerName = buyerName;
  }
  if (allergens !== undefined) {
    demoState.buyer.setting.allergens = [...allergens];
  }
  if (prompt !== undefined) {
    demoState.buyer.setting.prompt = prompt;
  }

  return cloneDeep(demoState.buyer) as BuyersMePatchResponse;
}

export async function deleteBuyersMe() {
  await waitMockDelay(120);
  return undefined as BuyersMeDeleteResponse;
}
