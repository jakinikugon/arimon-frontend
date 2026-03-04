import type { AccountType, UserId } from "../../domain";
import type { Email, Password } from "../../utility/scalars";
import type { JWT } from "../../utility/scalars";

export type AuthRegisterPostRequest = {
  email: Email;
  password: Password;
  accountType: AccountType;
};

export type AuthRegisterPostResponse = {
  userId: UserId;
  email: Email;
  accountType: AccountType;
  accessToken: JWT;
};
