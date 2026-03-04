import type { AuthLogoutPostResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function postAuthLogout() {
  return fetcher<AuthLogoutPostResponse>(backendApiUrl("/api/auth/logout"), {
    method: "POST",
  });
}
