import type { JWT } from "@/types/utility/scalars";

export type AccessToken = JWT;

/**
 * トークンを保存するためのシンプルなクラス
 * とりあえずはメモリ上に保存している
 */
class TokenStore {
  private accessToken: AccessToken | null = null;

  get() {
    return this.accessToken;
  }

  set(token: AccessToken | null) {
    this.accessToken = token;
  }
}

export const tokenStore = new TokenStore();
