import type { JanGetResponse } from "@/types/api";
import type { JanCode } from "@/types/utility/scalars";

import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export async function getJan(janCode: JanCode) {
  return fetcher<JanGetResponse>(backendApiUrl(`/api/jan/${janCode}`), {
    method: "GET",
  });
}
