import type { UserId } from "../common";
import type { UserName } from "./common";

export type BuyerName = UserName;

export type Allergen =
  | "egg"
  | "milk"
  | "wheat"
  | "buckwheat"
  | "peanut"
  | "shrimp"
  | "crab"
  | "walnut"
  | "abalone"
  | "squid"
  | "salmon_roe"
  | "orange"
  | "cashew_nut"
  | "kiwi"
  | "beef"
  | "sesame"
  | "salmon"
  | "mackerel"
  | "soybean"
  | "chicken"
  | "banana"
  | "pork"
  | "macadamia_nut"
  | "peach"
  | "yam"
  | "apple"
  | "gelatin"
  | "almond";

export type BuyerSetting = {
  buyerName: BuyerName;
  allergens: Allergen[];
  prompt: string;
};

export type Buyer = {
  id: UserId;
  setting: BuyerSetting;
};
