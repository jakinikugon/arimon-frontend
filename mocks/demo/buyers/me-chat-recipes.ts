import type { BuyersMeChatRecipesGetResponse } from "@/types/api";

import { demoState } from "../_state";
import { cloneDeep, waitMockDelay } from "../_utils";

export async function getBuyersMeChatRecipes() {
  await waitMockDelay(150);

  const recipes = demoState.chat.messages
    .filter((message) => message.role === "assistant")
    .flatMap((message) => message.recipes);

  return cloneDeep(recipes) as BuyersMeChatRecipesGetResponse;
}
