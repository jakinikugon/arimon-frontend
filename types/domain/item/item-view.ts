import type { JanCode, Timestamp } from "../../utility/scalars";
import type { StoreProfile } from "../user";
import type { Item, ItemCategory } from "./item";

export type ItemViewForBuyer = Item & {
   // 今のところUI上で必要な拡張情報はなさそう
};

export type ItemDetailForBuyer = ItemViewForBuyer & {
  description: string;
  store: StoreProfile;
  janCode: JanCode | null;
  category: ItemCategory;
  saleStart: Timestamp;
  saleEnd: Timestamp;
  limitDate: Timestamp;
};

export type ItemViewForStore = Item & {
  hidden: boolean;
};

export type ItemDetailForStore = ItemViewForStore & {
  description: string;
  janCode: JanCode | null;
  category: ItemCategory;
  saleStart: Timestamp;
  saleEnd: Timestamp;
  limitDate: Timestamp;
};
