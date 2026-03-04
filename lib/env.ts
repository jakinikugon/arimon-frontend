/**
 * 環境変数の管理ユーティリティ
 * - required: 必須の環境変数を取得。存在しない場合はエラーをスロー
 * - optional: 任意の環境変数を取得。存在しない場合はデフォルト値を返す
 * - EnvConfig: アプリ全体で使用する環境変数をまとめた定数オブジェクト
 */
import { toBoolean } from "@/utils/string";

// 一応残しておく
// const required = (name: string): string => {
//   const v = process.env[name];
//   if (v === undefined) throw new Error(`Missing env: ${name}`);
//   return v ?? "";
// };

// const optional = (name: string, defaultValue: string): string => {
//   const v = process.env[name];
//   return v ?? defaultValue;
// };

// process.env[name] だとundefinedになるため、上記の関数は使用できない？
// 代わりに、EnvConfigオブジェクトを使用して環境変数を管理する
export const EnvConfig = {
  meta: {
    rootUrl: process.env.NEXT_PUBLIC_ROOT_URL ?? "",
  },
  api: {
    backend: process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "",
    mock: process.env.NEXT_PUBLIC_MOCK_API_URL ?? "",
  },
  key: {},
  config: {
    useMocks: toBoolean(process.env.NEXT_PUBLIC_USE_MOCKS ?? "false"),
  },
  env: {
    state: process.env.NODE_ENV,
    development: process.env.NODE_ENV === "development",
    test: process.env.NODE_ENV === "test",
    production: process.env.NODE_ENV === "production",
  },
  util: {
    enableMocks:
      process.env.NODE_ENV === "development" &&
      toBoolean(process.env.NEXT_PUBLIC_USE_MOCKS ?? "false"),
  },
} as const;
