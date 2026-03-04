import type { AuthSessionGetResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getAuthSession() {
  return fetcher<AuthSessionGetResponse>(backendApiUrl("/api/auth/session"), {
    method: "GET",
  });
}
