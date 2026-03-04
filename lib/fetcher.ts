import { refresh } from "./auth/refresh";
import { tokenStore } from "./auth/token_store";

// 空のJSONオブジェクトを表す型
export type EmptyJSON = Record<string, never>;

/**
 * Fetch APIをラップした関数。認証トークンの自動付与とリフレッシュ機能を提供する
 * @param input - Fetch APIのinput(URLを想定)
 * @param init - Fetch APIのinitオブジェクト。HTTPメソッドやヘッダーなどを指定
 * @param auth - 自動認証機能必要かどうか。デフォルトはtrue。falseの場合はAuthorizationヘッダーを付与しない
 * @returns レスポンスのJSONデータをPromiseで返す。204 No Contentの場合はvoidを返す
 */
export async function fetcher<T>(
  input: string,
  init: RequestInit = {},
  auth: boolean = true,
): Promise<T> {
  // アクセストークンを付与してfetchする関数
  const doFetch = async (access: string | null) => {
    const headers = new Headers(init.headers);
    if (access) {
      headers.set("Authorization", `Bearer ${access}`);
    }
    return fetch(input, { ...init, headers });
  };

  // 1回目のfetch
  let res = await doFetch(auth ? tokenStore.get() : null);

  // 401 Unauthorizedの場合はリフレッシュを試みる
  if (auth && res.status === 401) {
    try {
      await refresh();
      res = await doFetch(tokenStore.get());
    } catch {
      // リフレッシュに失敗した場合はトークンをクリアしてエラーを投げる
      tokenStore.set(null);
      throw new Error("Unauthorized (refresh failed)");
    }
  }

  // HTTPエラーの場合はエラーを投げる
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
  }

  // 204 No Contentの場合はvoidを返す
  if (res.status === 204) {
    return undefined as T;
  }

  // JSONレスポンスを返す
  return (await res.json()) as T;
}
