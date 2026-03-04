import { authLogout } from "@/services";

import { tokenStore } from "./token_store";

/**
 * ログアウト処理を行う
 * - クライアント側のアクセストークンをクリア
 * - サーバー側にログアウトリクエストを送る
 */
export async function logout(): Promise<void> {
  try {
    await authLogout();
    tokenStore.set(null);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
