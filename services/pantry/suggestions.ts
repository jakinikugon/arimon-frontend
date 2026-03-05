import type { PantrySuggestionsGetResponse } from "@/types/api";

import { queryString } from "@/utils/url";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getPantrySuggestionsQuery(
  q: string,
  signal?: AbortSignal,
) {
  const path = queryString("/api/pantry/suggestions", { q });

  return fetcher<PantrySuggestionsGetResponse>(backendApiUrl(path), {
    method: "GET",
    signal,
  });
}
