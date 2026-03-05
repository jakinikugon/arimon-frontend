export const formatYen = (value: number) =>
  // Hydration failed エラーの原因を解消するため、ロゴを直接付与する方法に変更
  // style: "currency" を使用せず、"¥" を直接付与する

  `¥${new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 0,
  }).format(value)}`;
