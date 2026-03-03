import type { JWT } from "../../utility/scalars";

export type AuthRefreshPostRequest = {
  refreshToken: JWT;
};

export type AuthRefreshPostResponse = {
  accessToken: JWT;
  refreshToken: JWT;
};
