import type { BuyersMeChatRecipesGetResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getBuyersMeChatRecipes() {
  return fetcher<BuyersMeChatRecipesGetResponse>(
    backendApiUrl("/api/buyers/me/chat/recipes"),
    {
      method: "GET",
    },
  );
}
