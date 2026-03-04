import type { AuthLoginPostRequest, AuthLoginPostResponse } from "@/types/api";
import type { Email, Password } from "@/types/utility/scalars";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function authLogin(email: Email, password: Password) {
  const body: AuthLoginPostRequest = {
    email,
    password,
  };

  return fetcher<AuthLoginPostResponse>(backendApiUrl("/api/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
