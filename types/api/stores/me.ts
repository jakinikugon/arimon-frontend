import type { Store, StoreSetting } from "../../domain";

export type StoresMeGetResponse = Store;

export type StoresMePatchRequest = Partial<StoreSetting>;

export type StoresMePatchResponse = Store;
