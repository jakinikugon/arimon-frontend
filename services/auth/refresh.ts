import type { AuthRefreshPostResponse } from "@/types/api";

import { backendApiUrl } from "@/lib/api";

/**
 * アクセストークンをリフレッシュする
 * @returns 新しいアクセストークンを含むレスポンス
 */
export async function authRefresh(): Promise<AuthRefreshPostResponse> {
  const res = await fetch(backendApiUrl("/api/auth/refresh"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = (await res.json()) as AuthRefreshPostResponse;
  return data;
}
