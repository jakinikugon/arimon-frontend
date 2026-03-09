import type { Chat } from "../../domain";

export type BuyersMeChatMessagesGetResponse = Chat;

export type BuyersMeChatMessagesPostRequest = {
  content: string;
};

export type BuyersMeChatMessagesPostResponse = Chat;

export type BuyersMeChatMessagesDeleteResponse = Chat;
