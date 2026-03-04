import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type { AuthSessionGetResponse } from "@/types/api";

export async function getAuthSession() {
  return fetcher<AuthSessionGetResponse>(backendApiUrl("/api/auth/session"), {
    method: "GET",
  });
}
