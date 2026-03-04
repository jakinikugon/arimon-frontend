import type {
  AuthRegisterPostRequest,
  AuthRegisterPostResponse,
} from "@/types/api";
import type { AccountType } from "@/types/domain";
import type { Email, Password } from "@/types/utility/scalars";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

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

  return fetcher<AuthRegisterPostResponse>(
    backendApiUrl("/api/auth/register"),
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}
