import type { AccountType, UserId, UserName } from "../../domain";

export type AuthSessionGetResponse = {
  userId: UserId;
  accountType: AccountType;
  userName: UserName | null;
};
