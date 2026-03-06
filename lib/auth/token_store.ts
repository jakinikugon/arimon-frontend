import type { JWT } from "@/types/utility/scalars";

export type AccessToken = JWT;
const ACCESS_TOKEN_STORAGE_KEY = "arimon.access_token";

function readFromStorage(): AccessToken | null {
  if (typeof window === "undefined") return null;
  try {
    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    return token as AccessToken | null;
  } catch {
    return null;
  }
}

function writeToStorage(token: AccessToken | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token === null) {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch {
    // Storage が使えない環境でもメモリ保持は継続する
  }
}

/**
 * トークンを保存するためのシンプルなクラス
 * メモリ + localStorage に保存する
 */
class TokenStore {
  private accessToken: AccessToken | null = null;

  get() {
    if (this.accessToken !== null) {
      return this.accessToken;
    }

    this.accessToken = readFromStorage();
    return this.accessToken;
  }

  set(token: AccessToken | null) {
    this.accessToken = token;
    writeToStorage(token);
  }
}

export const tokenStore = new TokenStore();
