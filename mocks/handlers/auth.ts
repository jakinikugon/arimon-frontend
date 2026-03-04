import { HttpResponse, http } from "msw";

import type {
  AuthLoginPostResponse,
  AuthRefreshPostResponse,
  AuthRegisterPostRequest,
  AuthRegisterPostResponse,
  AuthSessionGetResponse,
} from "@/types/api";
import type { Email, JWT } from "@/types/utility/scalars";

import { buyerId } from "./data";

export const authHandlers = [
  http.post("*/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as Partial<AuthRegisterPostRequest>;
    const response: AuthRegisterPostResponse = {
      userId: buyerId,
      email: (body.email ?? ("demo@example.com" as Email)) as Email,
      accountType: body.accountType ?? "buyer",
      accessToken: "mock-access-token" as JWT,
    };

    return HttpResponse.json(response);
  }),

  http.post("*/api/auth/login", () => {
    const response: AuthLoginPostResponse = {
      accessToken: "mock-access-token" as JWT,
    };
    return HttpResponse.json(response);
  }),

  http.post("*/api/auth/logout", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post("*/api/auth/refresh", () => {
    const response: AuthRefreshPostResponse = {
      accessToken: "mock-access-token-refreshed" as JWT,
    };
    return HttpResponse.json(response);
  }),

  http.get("*/api/auth/session", () => {
    const response: AuthSessionGetResponse = {
      userId: buyerId,
      accountType: "buyer",
      userName: "Demo Buyer",
    };
    return HttpResponse.json(response);
  }),
];
