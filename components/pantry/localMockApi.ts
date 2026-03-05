import type { ItemCategory, Pantry, PantryItemId } from "@/types/domain";
import type { Chat, Recipe } from "@/types/domain/chat";
import type { JanCode } from "@/types/utility/scalars";

let pantryStore: Pantry = {
  items: [
    {
      id: "00000000-0000-4000-8000-000000000201" as PantryItemId,
      name: "Onion",
      janCode: null,
      category: "vegetable",
    },
  ],
};

let chatStore: Chat = {
  messages: [
    {
      role: "assistant",
      content: "Tomato pasta is a good option.",
      recipes: [
        {
          title: "Quick Tomato Pasta",
          description: "Simple pasta recipe.",
          materials: [
            {
              name: "Tomato",
              query: "tomato",
              inPantry: true,
            },
            {
              name: "Pasta",
              query: "pasta",
              inPantry: false,
            },
          ],
        },
      ],
    },
    {
      role: "user",
      content: "Any easy dinner ideas?",
      recipes: null,
    },
  ],
};

const categoryStore: ItemCategory[] = ["vegetable", "dairy", "meat", "fruit"];
const suggestionCandidates = ["tomato", "onion", "milk", "egg", "rice"];

let pantrySequence = 299;

function clonePantry(pantry: Pantry): Pantry {
  return {
    items: pantry.items.map((item) => ({
      ...item,
    })),
  };
}

function cloneRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.map((recipe) => ({
    ...recipe,
    materials: recipe.materials.map((material) => ({ ...material })),
  }));
}

function cloneChat(chat: Chat): Chat {
  return {
    messages: chat.messages.map((message) =>
      message.role === "assistant"
        ? {
            role: "assistant",
            content: message.content,
            recipes: cloneRecipes(message.recipes),
          }
        : {
            role: "user",
            content: message.content,
            recipes: null,
          },
    ),
  };
}

async function wait(ms: number, signal?: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      resolve();
    }, ms);

    const onAbort = () => {
      window.clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function nextPantryItemId() {
  pantrySequence += 1;
  return `00000000-0000-4000-8000-${String(pantrySequence).padStart(12, "0")}` as PantryItemId;
}

export async function localGetBuyersMePantry() {
  await wait(120);
  return clonePantry(pantryStore);
}

export async function localGetCategories() {
  await wait(100);
  return [...categoryStore];
}

export async function localGetPantrySuggestionsQuery(
  q: string,
  signal?: AbortSignal,
) {
  await wait(180, signal);
  const normalized = q.trim().toLowerCase();
  if (!normalized) {
    return [...suggestionCandidates];
  }
  return suggestionCandidates.filter((candidate) =>
    candidate.toLowerCase().includes(normalized),
  );
}

export async function localGetJan(janCode: JanCode) {
  await wait(120);
  const text = String(janCode);
  return {
    name: text.endsWith("1") ? "Fresh Milk" : "Discount Tomato",
    category: (text.endsWith("1") ? "dairy" : "vegetable") as ItemCategory,
  };
}

export async function localPostBuyersMePantry(
  name: string,
  janCode: JanCode | null,
  category: ItemCategory,
) {
  await wait(160);

  const duplicated = pantryStore.items.some(
    (item) =>
      item.name === name &&
      item.janCode === janCode &&
      item.category === category,
  );

  if (!duplicated) {
    pantryStore = {
      items: [
        ...pantryStore.items,
        {
          id: nextPantryItemId(),
          name,
          janCode,
          category,
        },
      ],
    };
  }

  return clonePantry(pantryStore);
}

export async function localDeleteBuyersMePantry(pantryItemId: PantryItemId) {
  await wait(140);
  pantryStore = {
    items: pantryStore.items.filter((item) => item.id !== pantryItemId),
  };
  return clonePantry(pantryStore);
}

export async function localGetBuyersMeChatMessages() {
  await wait(120);
  return cloneChat(chatStore);
}

export async function localPostBuyersMeChatMessages(content: string) {
  await wait(200);
  chatStore = {
    messages: [
      ...chatStore.messages,
      {
        role: "user",
        content,
        recipes: null,
      },
    ],
  };
  return cloneChat(chatStore);
}

export async function localGetBuyersMeChatRecipes() {
  await wait(100);
  const recipes =
    chatStore.messages.find((message) => message.role === "assistant")
      ?.recipes ?? [];
  return cloneRecipes(recipes);
}
