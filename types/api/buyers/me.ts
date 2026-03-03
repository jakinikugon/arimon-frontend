import type { Buyer, BuyerSetting } from "../../domain";

export type BuyersMeGetResponse = Buyer;

export type BuyersMePatchRequest = Partial<BuyerSetting>;

export type BuyersMePatchResponse = Buyer;
