import { Recipe } from "./recipe";

export type Role = "assistant" | "user";

export type ChatMessage = {
  role: Role;
  content: string;
  recipes: Recipe[] | null;
};

export type Chat = {
  messages: ChatMessage[];
};
