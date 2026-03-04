import { HttpResponse, http } from "msw";

import { authHandlers } from "./handlers/auth";
import { buyersHandlers } from "./handlers/buyers";
import { categoriesHandlers } from "./handlers/categories";
import { itemsHandlers } from "./handlers/items";
import { janHandlers } from "./handlers/jan";
import { pantryHandlers } from "./handlers/pantry";
import { storesHandlers } from "./handlers/stores";
import { uploadHandlers } from "./handlers/upload";

export const mswTestEndpoint = "https://msw.test.com";

export const handlers = [
  // MSW test endpoint
  http.get(mswTestEndpoint, () => {
    return HttpResponse.json({ message: "Hello from MSW!" });
  }),

  // Add additional mock handlers below
  ...authHandlers,
  ...categoriesHandlers,
  ...pantryHandlers,
  ...janHandlers,
  ...itemsHandlers,
  ...storesHandlers,
  ...buyersHandlers,
  ...uploadHandlers,
];
