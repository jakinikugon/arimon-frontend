import type { AccountType, UserId } from "../../domain";

export type AuthSessionGetResponse = {
  userId: UserId;
  accountType: AccountType;
};
