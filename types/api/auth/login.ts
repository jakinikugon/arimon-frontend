import type { Email, Password } from "../../utility/scalars";

export type AuthLoginPostRequest = {
  email: Email;
  password: Password;
};
