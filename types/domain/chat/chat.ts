import type { Material } from "../pantry";

export type Role = "assistant" | "user";

export type Recipe = {
  title: string;
  description: string;
  materials: Material[];
};

export type ChatMessage = {
  role: Role;
  content: string;
  recipes: Recipe[] | null;
};

export type Recipes = Recipe[];

export type Chat = {
  messages: ChatMessage[];
};
