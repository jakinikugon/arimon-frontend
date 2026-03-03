import type { Reports } from "../../domain";

export type StoresMeReportsGetResponse = Omit<Reports, "totalDiscount">;
