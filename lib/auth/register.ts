import { authRegister } from "@/services";

import type { AccountType } from "@/types/domain";
import type { Email, Password } from "@/types/utility/scalars";

import { type AccessToken, tokenStore } from "./token_store";

/**
 * ユーザー登録処理を行う
 * - サーバーにユーザー登録リクエストを送る
 * - 成功したらアクセストークンをTokenStoreに保存する
 * @param email メールアドレス
 * @param password パスワード
 * @param accountType アカウントタイプ
 */
export async function register(
  email: Email,
  password: Password,
  accountType: AccountType,
): Promise<AccessToken> {
  try {
    const response = await authRegister(email, password, accountType);
    tokenStore.set(response.accessToken);
    return response.accessToken;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
