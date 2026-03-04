/**
 * URLを結合するユーティリティ関数
 * URLの末尾や先頭のスラッシュを適切に処理して、正しいURLを返す
 * @param base ベースURL（e.g. "https://example.com"）
 * @param path URLパス（e.g. "api/data"）
 * @returns 完全なURL（e.g. "https://example.com/api/data"）
 */
export function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return `${cleanBase}/${cleanPath}`;
}

export function queryString(baseurl: string, query: Record<string, string>): string {
  const params = new URLSearchParams(query).toString();
  return `${baseurl}?${params}`;
}
