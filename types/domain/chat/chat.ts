import { Recipe } from "./recipe";

export type Role = "assistant" | "user";

export type ChatMessage =
  | {
      role: "assistant";
      content: string;
      recipes: Recipe[];
    }
  | {
      role: "user";
      content: string;
      recipes: null;
    };

export type Chat = {
  messages: ChatMessage[];
};
