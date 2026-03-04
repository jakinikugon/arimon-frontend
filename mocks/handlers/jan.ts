import { HttpResponse, http } from "msw";

import type { JanGetResponse } from "@/types/api";

export const janHandlers = [
  http.get("*/api/jan/:janCode", ({ params }) => {
    const janCode = String(params.janCode ?? "");
    const response: JanGetResponse = {
      name: janCode.endsWith("1") ? "Fresh Milk" : "Discount Tomato",
      category: janCode.endsWith("1") ? "dairy" : "vegetable",
    };
    return HttpResponse.json(response);
  }),
];
