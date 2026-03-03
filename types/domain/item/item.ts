import type { URL } from "../../utility/scalars";
import type { ItemId } from "../common";

export type ItemCategory = string;

export type Item = {
  id: ItemId;
  name: string;
  imageUrl: URL;
  price: {
    regular: number;
    discount: number;
  };
};
