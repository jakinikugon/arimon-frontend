import { authLogin } from "@/services";

import type { Email, Password } from "@/types/utility/scalars";

import { type AccessToken, tokenStore } from "./token_store";

/**
 * ログイン処理を行う
 * - サーバーにログインリクエストを送る
 * - 成功したらアクセストークンをTokenStoreに保存する
 * @param email メールアドレス
 * @param password パスワード
 */
export async function login(
  email: Email,
  password: Password,
): Promise<AccessToken> {
  try {
    const response = await authLogin(email, password);
    tokenStore.set(response.accessToken);
    return response.accessToken;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
