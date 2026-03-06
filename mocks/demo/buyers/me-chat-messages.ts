import type {
  BuyersMeChatMessagesGetResponse,
  BuyersMeChatMessagesPostResponse,
} from "@/types/api";

import { demoState } from "../_state";
import { cloneDeep, waitMockDelay } from "../_utils";

function buildAssistantReply(content: string) {
  const pantryTop = demoState.pantry.items.slice(0, 2);
  const pantryLabel =
    pantryTop.length > 0
      ? pantryTop.map((item) => item.name).join("・")
      : "手元の食材";

  return {
    role: "assistant" as const,
    content: `「${content}」を踏まえて、${pantryLabel}を使える献立を優先して提案します。`,
    recipes: [
      {
        title: "平日向けワンボウル献立",
        description:
          "炒める工程を最小限にして、20分以内で仕上がる構成にしています。",
        materials: [
          ...pantryTop.map((item) => ({
            name: item.name,
            query: item.name,
            inPantry: true,
          })),
          {
            name: "鶏むね肉",
            query: "鶏むね肉",
            inPantry: false,
          },
        ],
      },
    ],
  };
}

export async function getBuyersMeChatMessages() {
  await waitMockDelay();
  return cloneDeep(demoState.chat) as BuyersMeChatMessagesGetResponse;
}

export async function postBuyersMeChatMessages(content: string) {
  await waitMockDelay(240);

  demoState.chat.messages.push({
    role: "user",
    content,
    recipes: null,
  });
  demoState.chat.messages.push(buildAssistantReply(content));

  return cloneDeep(demoState.chat) as BuyersMeChatMessagesPostResponse;
}
