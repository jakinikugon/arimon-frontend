import type { ItemCategory, Pantry, PantryItemId } from "@/types/domain";
import type { Chat, ChatMessage, Recipe } from "@/types/domain/chat";
import type { JanCode } from "@/types/utility/scalars";

let pantryStore: Pantry = {
  items: [
    {
      id: "00000000-0000-4000-8000-000000000201" as PantryItemId,
      name: "たまねぎ",
      janCode: null,
      category: "野菜",
    },
    {
      id: "00000000-0000-4000-8000-000000000202" as PantryItemId,
      name: "卵",
      janCode: null,
      category: "卵・乳製品",
    },
    {
      id: "00000000-0000-4000-8000-000000000203" as PantryItemId,
      name: "牛乳",
      janCode: "4901234567891" as JanCode,
      category: "卵・乳製品",
    },
  ],
};

let chatStore: Chat = {
  messages: [
    {
      role: "user",
      content: "今夜は時短で作れるメニューがいいです。",
      recipes: null,
    },
    {
      role: "assistant",
      content: "冷蔵庫の食材を踏まえて、まずは作りやすい献立を2件提案します。",
      recipes: [
        {
          title: "たまごミルクスープ",
          description: "卵と牛乳を使って10分で作れるやさしいスープです。",
          materials: [
            {
              name: "卵",
              query: "卵",
              inPantry: true,
            },
            {
              name: "牛乳",
              query: "牛乳",
              inPantry: true,
            },
            {
              name: "コンソメ",
              query: "コンソメ",
              inPantry: false,
            },
          ],
        },
        {
          title: "オニオンオムレツ",
          description: "たまねぎの甘みを活かした簡単オムレツです。",
          materials: [
            {
              name: "たまねぎ",
              query: "たまねぎ",
              inPantry: true,
            },
            {
              name: "卵",
              query: "卵",
              inPantry: true,
            },
            {
              name: "バター",
              query: "バター",
              inPantry: false,
            },
          ],
        },
      ],
    },
  ],
};

type RecipeTemplate = {
  title: string;
  description: string;
  materials: Array<{
    name: string;
    query: string;
  }>;
};

const RECIPE_TEMPLATE_GROUPS: Record<string, RecipeTemplate[]> = {
  breakfast: [
    {
      title: "ミルクフレンチトースト",
      description: "朝食向け。卵と牛乳を使った時短メニューです。",
      materials: [
        { name: "食パン", query: "食パン" },
        { name: "卵", query: "卵" },
        { name: "牛乳", query: "牛乳" },
        { name: "砂糖", query: "砂糖" },
      ],
    },
    {
      title: "たまねぎ入りスクランブルエッグ",
      description: "甘みのあるたまねぎで満足感を出せます。",
      materials: [
        { name: "卵", query: "卵" },
        { name: "たまねぎ", query: "たまねぎ" },
        { name: "オリーブオイル", query: "オリーブオイル" },
      ],
    },
  ],
  pasta: [
    {
      title: "ミルククリームパスタ",
      description: "牛乳ベースの簡単クリームパスタです。",
      materials: [
        { name: "パスタ", query: "パスタ" },
        { name: "牛乳", query: "牛乳" },
        { name: "たまねぎ", query: "たまねぎ" },
        { name: "ベーコン", query: "ベーコン" },
      ],
    },
    {
      title: "たまご和風パスタ",
      description: "卵でコクを加える和風アレンジです。",
      materials: [
        { name: "パスタ", query: "パスタ" },
        { name: "卵", query: "卵" },
        { name: "めんつゆ", query: "めんつゆ" },
        { name: "のり", query: "のり" },
      ],
    },
  ],
  soup: [
    {
      title: "オニオンコンソメスープ",
      description: "たまねぎを使った定番スープです。",
      materials: [
        { name: "たまねぎ", query: "たまねぎ" },
        { name: "コンソメ", query: "コンソメ" },
        { name: "黒こしょう", query: "黒こしょう" },
      ],
    },
    {
      title: "たまご中華スープ",
      description: "短時間で作れる中華風のスープです。",
      materials: [
        { name: "卵", query: "卵" },
        { name: "鶏ガラスープ", query: "鶏ガラスープ" },
        { name: "ごま油", query: "ごま油" },
      ],
    },
  ],
  quick: [
    {
      title: "たまごチャーハン",
      description: "卵を使って手早く作れる定番メニューです。",
      materials: [
        { name: "ごはん", query: "ごはん" },
        { name: "卵", query: "卵" },
        { name: "たまねぎ", query: "たまねぎ" },
      ],
    },
    {
      title: "ミルクたまごグラタン",
      description: "牛乳と卵を活かした簡易グラタンです。",
      materials: [
        { name: "牛乳", query: "牛乳" },
        { name: "卵", query: "卵" },
        { name: "チーズ", query: "チーズ" },
        { name: "パン粉", query: "パン粉" },
      ],
    },
  ],
};

const categoryStore: ItemCategory[] = [
  "野菜",
  "果物",
  "飲料",
  "インスタント食品",
  "卵・乳製品",
  "肉",
  "魚",
  "調味料",
  "その他",
];
const suggestionCandidates = [
  "たまねぎ",
  "にんじん",
  "じゃがいも",
  "卵",
  "牛乳",
  "豆腐",
  "鶏むね肉",
  "食パン",
];

const JAN_ITEM_MASTER: Record<
  string,
  {
    name: string;
    category: ItemCategory;
  }
> = {
  "4908819940721": {
    name: "さが美人",
    category: "果物",
  },
  "4901340689312": {
    name: "カルピス",
    category: "飲料",
  },
  "4901734057826": {
    name: "博多ShinShin",
    category: "インスタント食品",
  },
};

let pantrySequence = 299;

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

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
      signal?.removeEventListener("abort", onAbort);
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

function pickRecipeTemplates(content: string) {
  const normalizedContent = normalizeText(content);

  if (content.includes("朝") || normalizedContent.includes("breakfast")) {
    return RECIPE_TEMPLATE_GROUPS.breakfast;
  }

  if (
    content.includes("パスタ") ||
    content.includes("麺") ||
    normalizedContent.includes("pasta")
  ) {
    return RECIPE_TEMPLATE_GROUPS.pasta;
  }

  if (
    content.includes("スープ") ||
    content.includes("汁") ||
    content.includes("鍋")
  ) {
    return RECIPE_TEMPLATE_GROUPS.soup;
  }

  return RECIPE_TEMPLATE_GROUPS.quick;
}

function createRecipesFromContent(content: string): Recipe[] {
  const pantryNameSet = new Set(
    pantryStore.items.map((item) => normalizeText(item.name)),
  );

  return pickRecipeTemplates(content).map((template) => ({
    title: template.title,
    description: template.description,
    materials: template.materials.map((material) => ({
      name: material.name,
      query: material.query,
      inPantry: pantryNameSet.has(normalizeText(material.name)),
    })),
  }));
}

function createAssistantReply(userContent: string): Extract<
  ChatMessage,
  {
    role: "assistant";
  }
> {
  const recipes = createRecipesFromContent(userContent);
  const pantryPreview = pantryStore.items
    .slice(0, 3)
    .map((item) => item.name)
    .join("、");

  const content = pantryPreview
    ? `冷蔵庫の「${pantryPreview}」と会話内容を踏まえて、${recipes.length}件の献立を提案しました。`
    : `会話内容を踏まえて、${recipes.length}件の献立を提案しました。`;

  return {
    role: "assistant",
    content,
    recipes,
  };
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
  const candidates = [
    ...new Set([
      ...suggestionCandidates,
      ...pantryStore.items.map((item) => item.name),
    ]),
  ];

  if (!normalized) {
    return candidates;
  }

  return candidates.filter((candidate) =>
    candidate.toLowerCase().includes(normalized),
  );
}

export async function localGetJan(janCode: JanCode) {
  await wait(120);
  const text = String(janCode);
  const item = JAN_ITEM_MASTER[text];

  if (!item) {
    throw new Error("JAN code not found in local mock");
  }

  return item;
}

export async function localPostBuyersMePantry(
  name: string,
  janCode: JanCode | null,
  category: ItemCategory,
) {
  await wait(160);
  const normalizedName = normalizeText(name);

  const duplicated = pantryStore.items.some(
    (item) =>
      normalizeText(item.name) === normalizedName &&
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
  await wait(220);

  const userMessage: ChatMessage = {
    role: "user",
    content,
    recipes: null,
  };
  const assistantReply = createAssistantReply(content);

  chatStore = {
    messages: [...chatStore.messages, userMessage, assistantReply],
  };

  return cloneChat(chatStore);
}

export async function localGetBuyersMeChatRecipes() {
  await wait(140);
  const history = chatStore.messages.flatMap((message) =>
    message.role === "assistant" ? message.recipes : [],
  );
  return cloneRecipes(history);
}
