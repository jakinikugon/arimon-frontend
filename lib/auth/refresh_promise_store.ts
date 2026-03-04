import type { AccessToken } from "./token_store";

class RefreshPromiseStore {
  private refreshPromise: Promise<AccessToken> | null = null;

  get() {
    return this.refreshPromise;
  }

  set(promise: Promise<AccessToken> | null) {
    this.refreshPromise = promise;
  }
}

export const refreshPromiseStore = new RefreshPromiseStore();
