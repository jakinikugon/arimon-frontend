import type { AuthLogoutPostResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";

export async function authLogout() {
  const res = await fetch(backendApiUrl("/api/auth/logout"), {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
  }

  const data = (await res.json()) as AuthLogoutPostResponse;
  return data;
}
