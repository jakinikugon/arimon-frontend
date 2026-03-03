import type { Pantry, PantryItem } from "../../domain";
import type { OmitId } from "../../utility/ts";

export type BuyersMePantryGetResponse = Pantry;

export type BuyersMePantryPostRequest = OmitId<PantryItem>;

export type BuyersMePantryPostResponse = Pantry;
