import { joinUrl } from "@/utils/url";

import { EnvConfig } from "@/lib/env";

/**
 * バックエンドAPIのエンドポイントURLを生成する
 * モックが有効かどうかで使用するベースURLを切り替える
 * @param path APIパス（e.g. "/data"）
 * @returns 完全なAPIエンドポイントURL
 */
export function backendApiUrl(path: string) {
  const base = EnvConfig.util.enableMocks
    ? EnvConfig.api.mock
    : EnvConfig.api.backend;
  return joinUrl(base, path);
}
