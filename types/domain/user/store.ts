import type { UserId } from "../common";
import type { UserName } from "./common";

export type StoreName = UserName;
export type StoreIconUrl = string;
export type StoreIntroduction = string;
export type StoreAddress = string;

export type StoreSetting = {
  storeName: StoreName;
  address: StoreAddress;
  iconUrl: StoreIconUrl;
  introduction: StoreIntroduction;
};

export type Store = {
  id: UserId;
  setting: StoreSetting;
};

export type StoreProfile = {
  id: UserId;
  storeName: StoreName;
  address: StoreAddress;
  iconUrl: StoreIconUrl;
  introduction: StoreIntroduction;
  reportsCount: number;
};
