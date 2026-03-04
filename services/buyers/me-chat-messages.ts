import { backendApiUrl } from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import type {
  BuyersMeChatMessagesGetResponse,
  BuyersMeChatMessagesPostRequest,
  BuyersMeChatMessagesPostResponse,
} from "@/types/api";

export async function getBuyersMeChatMessages() {
  return fetcher<BuyersMeChatMessagesGetResponse>(
    backendApiUrl("/api/buyers/me/chat/messages"),
    {
      method: "GET",
    },
  );
}

export async function postBuyersMeChatMessages(content: string) {
  const body: BuyersMeChatMessagesPostRequest = {
    content,
  };

  return fetcher<BuyersMeChatMessagesPostResponse>(
    backendApiUrl("/api/buyers/me/chat/messages"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}
