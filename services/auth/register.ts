import type {
  AuthRegisterPostRequest,
  AuthRegisterPostResponse,
} from "@/types/api";
import type { AccountType } from "@/types/domain";
import type { Email, Password } from "@/types/utility/scalars";

import { backendApiUrl } from "@/lib/api";

export async function authRegister(
  email: Email,
  password: Password,
  accountType: AccountType,
) {
  const body: AuthRegisterPostRequest = {
    email,
    password,
    accountType,
  };

  const res = await fetch(backendApiUrl("/api/auth/register"), {
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

  const data = (await res.json()) as AuthRegisterPostResponse;
  return data;
}
