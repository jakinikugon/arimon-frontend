import { EnvConfig } from "@/lib/env";
import { MetaConfig } from "@/lib/metadate";

const META_CONFIG: MetaConfig = {
  url: EnvConfig.meta.rootUrl,
  title: "ありもんナビ",
  description:
    "ありもんナビはお店の余剰食材の情報を提供することで、食品ロス削減に貢献するフードシェアリングサービスです。",
  twitterHandle: undefined,
  locale: "ja_JP",
  ogp: "/meta/logo.png",
  favicon: "/meta/favicon.ico",
  creator: "jakinikugon",
  keywords: [
    "ありもんナビ",
    "余剰食材",
    "食品ロス",
    "レシピ",
    "フードシェアリング",
  ],
};

export { META_CONFIG };
