import type { Email, JWT, Password } from "../../utility/scalars";

export type AuthLoginPostRequest = {
  email: Email;
  password: Password;
};

export type AuthLoginPostResponse = {
  accessToken: JWT;
  refreshToken: JWT;
};
