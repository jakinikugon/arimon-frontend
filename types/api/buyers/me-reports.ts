import type { ItemId, Reports } from "../../domain";
import type { Timestamp } from "../../utility/scalars";

export type BuyersMeReportsGetResponse = Reports;

export type BuyersMeReportsPostRequest = {
  itemId: ItemId;
  addPantry: boolean;
};

export type BuyersMeReportsPostResponse = {
  itemId: ItemId;
  addPantry: boolean;
  reportDate: Timestamp;
};
