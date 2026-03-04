import type { AccountType, UserId } from "../../domain";
import type { Email, Password } from "../../utility/scalars";

type AuthRegisterPostRequest = {
  email: Email;
  password: Password;
  accountType: AccountType;
};

type AuthRegisterPostResponse = {
  userId: UserId;
  email: Email;
  accountType: AccountType;
  accessToken: JWT;
};
