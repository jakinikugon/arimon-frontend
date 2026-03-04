import type { ItemDetailForStore } from "../../domain";
import type { OmitId } from "../../utility/ts";

export type StoresMeItemsDetailsGetResponse = ItemDetailForStore;

export type StoresMeItemsDetailsPatchRequest = Partial<
  OmitId<ItemDetailForStore>
>;

export type StoresMeItemsDetailsPatchResponse = ItemDetailForStore;

export type StoresMeItemsDetailsDeleteResponse = void;
