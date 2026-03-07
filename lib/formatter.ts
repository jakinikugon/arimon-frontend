/**
 * 金額を日本円表記にフォーマットする
 * @param value 金額の数値
 * @returns 日本円表記の文字列（例: "¥1,000"）
 */
export const formatYen = (value: number) =>
  // Hydration failed エラーの原因を解消するため、記号を直接付与する方法に変更
  // style: "currency" を使用せず、"¥" を直接付与する

  `¥${new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(value)}`;

/**
 * ISO 8601形式の日時文字列を日本のローカル日時表記に変換する
 * @param iso ISO 8601形式の日時文字列
 * @returns 日本のローカル日時表記（例: "2024/06/30 15:30"）
 */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
