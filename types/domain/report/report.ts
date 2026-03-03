import type { Timestamp } from "../../utility/scalars";
import type { Item } from "../item/item";

export type Reports = {
  totalCount: number;
  totalDiscount: number;
  items: {
    item: Item;
    date: Timestamp;
  }[];
};
