import { HttpResponse, http } from "msw";

import type { PantrySuggestionsGetResponse } from "@/types/api";

export const pantryHandlers = [
  http.get("*/api/pantry/suggestions", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const candidates = ["tomato", "onion", "milk", "egg", "rice"];
    const response: PantrySuggestionsGetResponse = q
      ? candidates.filter((name) => name.toLowerCase().includes(q))
      : candidates;

    return HttpResponse.json(response);
  }),
];
