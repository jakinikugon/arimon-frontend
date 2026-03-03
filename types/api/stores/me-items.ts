import type { ItemDetailForStore, ItemViewForStore } from "../../domain";
import type { OmitId } from "../../utility/ts";

export type StoresMeItemsGetResponse = ItemViewForStore[];

export type StoresMeItemsPostRequest = OmitId<ItemDetailForStore>;

export type StoresMeItemsPostResponse = ItemDetailForStore;
