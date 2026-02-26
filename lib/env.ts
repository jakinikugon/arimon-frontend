/**
 * 環境変数の管理ユーティリティ
 * - required: 必須の環境変数を取得。存在しない場合はエラーをスロー
 * - optional: 任意の環境変数を取得。存在しない場合はデフォルト値を返す
 * - EnvConfig: アプリ全体で使用する環境変数をまとめた定数オブジェクト
 */
import { to_boolean } from "@/utils/string";

const required = (name: string): string => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
};

const optional = (name: string, defaultValue: string): string => {
  const v = process.env[name];
  return v ?? defaultValue;
};

export const EnvConfig = {
  api: {
    backend: required("NEXT_PUBLIC_BACKEND_API_URL"),
    mock: required("NEXT_PUBLIC_MOCK_API_URL"),
  },
  key: {},
  config: {
    useMocks: to_boolean(optional("NEXT_PUBLIC_USE_MOCKS", "false")),
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
      to_boolean(optional("NEXT_PUBLIC_USE_MOCKS", "false")),
  },
} as const;
