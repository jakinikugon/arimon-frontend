import type { Allergen } from "@/types/domain";

export const ALLERGEN_DATA: Record<Allergen, string> = {
  // 特定原材料（表示義務：8品目）
  egg: "卵",
  milk: "乳",
  wheat: "小麦",
  buckwheat: "そば",
  peanut: "落花生",
  shrimp: "えび",
  crab: "かに",
  walnut: "くるみ",

  // 特定原材料に準ずるもの（表示推奨：20品目）
  abalone: "あわび",
  squid: "いか",
  salmon_roe: "いくら",
  orange: "オレンジ",
  cashew_nut: "カシューナッツ",
  kiwi: "キウイフルーツ",
  beef: "牛肉",
  sesame: "ごま",
  salmon: "さけ",
  mackerel: "さば",
  soybean: "大豆",
  chicken: "鶏肉",
  banana: "バナナ",
  pork: "豚肉",
  macadamia_nut: "マカダミアナッツ",
  peach: "もも",
  yam: "やまいも",
  apple: "りんご",
  gelatin: "ゼラチン",
  almond: "アーモンド",
};
