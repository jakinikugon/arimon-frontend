import type { UploadImagePostResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function postUploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return fetcher<UploadImagePostResponse>(backendApiUrl("/api/upload/image"), {
    method: "POST",
    body: formData,
  });
}
