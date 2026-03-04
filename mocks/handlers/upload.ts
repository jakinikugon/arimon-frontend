import { HttpResponse, http } from "msw";

import type { UploadImagePostResponse } from "@/types/api";
import type { ImageId } from "@/types/domain";
import type { URL } from "@/types/utility/scalars";

export const uploadHandlers = [
  http.post("*/api/upload/image", () => {
    const response: UploadImagePostResponse = {
      id: "00000000-0000-4000-8000-000000000301" as ImageId,
      imageUrl: "https://example.com/uploads/mock-image.png" as URL,
    };
    return HttpResponse.json(response);
  }),
];
