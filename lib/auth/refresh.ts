import { authRefresh } from "@/services";

import { refreshPromiseStore } from "./refresh_promise_store";
import { type AccessToken, tokenStore } from "./token_store";

/**
 * アクセストークンをリフレッシュする
 * - サーバーにリフレッシュリクエストを送る
 * - 成功したら新しいアクセストークンをTokenStoreに保存する
 * - 同時に複数のリフレッシュ処理が走る可能性があるため、基本的に使用しない
 * @returns 新しいアクセストークン
 */
export async function _refresh(): Promise<AccessToken> {
  try {
    const data = await authRefresh();
    tokenStore.set(data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    tokenStore.set(null);
    throw error;
  }
}

/**
 * アクセストークンをリフレッシュする処理を一度だけ実行する
 * - すでにリフレッシュ中の場合は、そのPromiseを返す
 * - リフレッシュ処理はこちらの関数を通じて行うことを想定
 * @returns 新しいアクセストークン
 */
export async function refresh(): Promise<AccessToken> {
  const inFlight = refreshPromiseStore.get();
  if (inFlight) return inFlight;

  const p = _refresh()
    .then((token) => {
      return token;
    })
    .finally(() => {
      refreshPromiseStore.set(null);
    });

  refreshPromiseStore.set(p);
  return p;
}
