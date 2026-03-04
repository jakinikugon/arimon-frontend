import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { UploadImagePostResponse } from "@/types/api";
import type { ImageId } from "@/types/domain";

export async function postUploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return fetcher<UploadImagePostResponse>(backendApiUrl("/api/upload/image"), {
    method: "POST",
    body: formData,
  });
}

export function getUploadImage(imageId: ImageId) {
  return backendApiUrl(`/api/upload/image/${imageId}`);
}
