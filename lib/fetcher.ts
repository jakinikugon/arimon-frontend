// 空のJSONオブジェクトを表す型
export type EmptyJSON = Record<string, never>;

/**
 * REST APIを呼び出す
 * "Content-Type": "application/json"はデフォルトで設定される(オプションで上書き可能)
 * @param url - APIエンドポイントのURL
 * @param options - Fetch APIオプション
 * @returns JSONレスポンスを解決する、またはエラーで拒否されるPromise
 */
export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
