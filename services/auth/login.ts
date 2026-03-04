import type { AuthLoginPostRequest, AuthLoginPostResponse } from "@/types/api";
import type { Email, Password } from "@/types/utility/scalars";

import { backendApiUrl } from "@/lib/api";

export async function authLogin(
  email: Email,
  password: Password,
): Promise<AuthLoginPostResponse> {
  const body: AuthLoginPostRequest = {
    email,
    password,
  };

  const res = await fetch(backendApiUrl("/api/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
  }

  const data = (await res.json()) as AuthLoginPostResponse;
  return data;
}
