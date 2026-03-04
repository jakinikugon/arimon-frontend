import { HttpResponse, http } from "msw";

import type { CategoriesGetResponse } from "@/types/api";

export const categoriesHandlers = [
  http.get("*/api/categories", () => {
    const response: CategoriesGetResponse = ["vegetable", "dairy", "meat", "fruit"];
    return HttpResponse.json(response);
  }),
];
