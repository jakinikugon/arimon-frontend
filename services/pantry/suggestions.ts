import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { PantrySuggestionsGetResponse } from "@/types/api";
import { queryString } from "@/utils/url";

export async function getPantrySuggestionsQuery(q: string) {
  const path = queryString("/api/pantry/suggestions", { q });

  return fetcher<PantrySuggestionsGetResponse>(backendApiUrl(path), {
    method: "GET",
  });
}
