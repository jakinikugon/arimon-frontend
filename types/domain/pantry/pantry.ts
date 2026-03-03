import type { JanCode } from "../../utility/scalars";
import type { PantryItemId } from "../common";
import type { ItemCategory } from "../item/item";

export type PantryItem = {
  id: PantryItemId;
  name: string;
  janCode: JanCode | null;
  category: ItemCategory;
};

export type Pantry = {
  items: PantryItem[];
};
