"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoReload } from "react-icons/io5";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

import type { ChatMessage, Recipe } from "@/types/domain";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import {
  localGetBuyersMeChatMessages as getBuyersMeChatMessages,
  localGetBuyersMeChatRecipes as getBuyersMeChatRecipes,
  localPostBuyersMeChatMessages as postBuyersMeChatMessages,
} from "../../mocks/simple/localMockApi";

// import {
//   getBuyersMeChatMessages,
//   getBuyersMeChatRecipes,
//   postBuyersMeChatMessages,
// } from "@/services";
// import { CheckCircle2, Loader2, XCircle } from "lucide-react";

type InlineErrorProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  disabled?: boolean;
};

function InlineError({
  message,
  onRetry,
  retryLabel = "再試行",
  className,
  disabled = false,
}: InlineErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700",
        className,
      )}
      role="alert"
    >
      <XCircle className="size-4 shrink-0" />
      <p>{message}</p>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto border-red-300 bg-white text-red-700 hover:bg-red-100"
          onClick={onRetry}
          disabled={disabled}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

function ChatListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="ml-auto h-12 w-2/3" />
      <Skeleton className="h-12 w-4/5" />
    </div>
  );
}

function RecipeListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

type ChatTab = "chat" | "recipes";

type RecipeAccordionProps = {
  recipes: Recipe[];
  valuePrefix: string;
};

function buildItemsHref(query: string) {
  const normalized = query.trim();
  if (!normalized) {
    return "/items";
  }
  return `/items?q=${encodeURIComponent(normalized)}`;
}

function RecipeAccordion({ recipes, valuePrefix }: RecipeAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {recipes.map((recipe, recipeIndex) => (
        <AccordionItem
          key={`${valuePrefix}-${recipe.title}-${recipeIndex}`}
          value={`${valuePrefix}-recipe-${recipeIndex}`}
        >
          <AccordionTrigger className="py-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{recipe.title}</p>
              <p className="text-muted-foreground text-xs">
                {recipe.description}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <ul className="space-y-2">
              {recipe.materials.map((material, materialIndex) => {
                const searchQuery = material.query.trim() || material.name;
                return (
                  <li
                    key={`${valuePrefix}-${recipe.title}-${searchQuery}-${materialIndex}`}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-md border px-3 py-2",
                      material.inPantry
                        ? "border-brand-accent-300 bg-brand-accent-50"
                        : "bg-muted/40",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {material.inPantry ? (
                        <CheckCircle2 className="text-brand-accent-700 mt-0.5 size-4" />
                      ) : (
                        <XCircle className="mt-0.5 size-4 text-gray-500" />
                      )}
                      <div>
                        <Link
                          href={buildItemsHref(searchQuery)}
                          className="text-sm font-medium underline-offset-2 hover:underline"
                        >
                          {material.name}
                        </Link>
                        <p className="text-muted-foreground text-xs">
                          検索語: {searchQuery}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium whitespace-nowrap",
                        material.inPantry
                          ? "text-brand-accent-800"
                          : "text-muted-foreground",
                      )}
                    >
                      {material.inPantry ? "冷蔵庫にあり" : "買い足し候補"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ChatField() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [recipeHistory, setRecipeHistory] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<ChatTab>("chat");
  const [chatInput, setChatInput] = useState("");

  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isRecipeHistoryLoading, setIsRecipeHistoryLoading] = useState(false);
  const [isChatSubmitting, setIsChatSubmitting] = useState(false);

  const [chatError, setChatError] = useState<string | null>(null);
  const [recipeHistoryError, setRecipeHistoryError] = useState<string | null>(
    null,
  );
  const [chatSubmitError, setChatSubmitError] = useState<string | null>(null);

  const recipeHistoryRequestIdRef = useRef(0);

  const loadChatMessages = useCallback(async () => {
    setIsChatLoading(true);
    setChatError(null);
    try {
      const response = await getBuyersMeChatMessages();
      setChatMessages(response.messages);
    } catch {
      setChatError("チャット履歴の取得に失敗しました。");
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  const loadRecipeHistory = useCallback(async () => {
    const requestId = recipeHistoryRequestIdRef.current + 1;
    recipeHistoryRequestIdRef.current = requestId;

    setIsRecipeHistoryLoading(true);
    setRecipeHistoryError(null);

    try {
      const response = await getBuyersMeChatRecipes();
      if (recipeHistoryRequestIdRef.current !== requestId) {
        return;
      }
      setRecipeHistory(response);
    } catch {
      if (recipeHistoryRequestIdRef.current !== requestId) {
        return;
      }
      setRecipeHistoryError("献立履歴の取得に失敗しました。");
    } finally {
      if (recipeHistoryRequestIdRef.current === requestId) {
        setIsRecipeHistoryLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadChatMessages();
  }, [loadChatMessages]);

  useEffect(() => {
    if (activeTab !== "recipes") {
      return;
    }
    void loadRecipeHistory();
  }, [activeTab, loadRecipeHistory]);

  const handleSubmitChat = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const content = chatInput.trim();
      if (!content) {
        return;
      }

      const optimisticUserMessage: ChatMessage = {
        role: "user",
        content,
        recipes: null,
      };

      setChatMessages((current) => [...current, optimisticUserMessage]);
      setChatInput("");
      setIsChatSubmitting(true);
      setChatSubmitError(null);

      try {
        const response = await postBuyersMeChatMessages(content);
        const latestAssistantMessage = [...response.messages]
          .reverse()
          .find((message) => message.role === "assistant");

        if (latestAssistantMessage) {
          setChatMessages((current) => [...current, latestAssistantMessage]);
        }
      } catch {
        setChatMessages((current) =>
          current.filter((message, index) => {
            if (index !== current.length - 1) {
              return true;
            }
            return !(message.role === "user" && message.content === content);
          }),
        );
        setChatSubmitError("メッセージ送信に失敗しました。");
      } finally {
        setIsChatSubmitting(false);
      }
    },
    [chatInput],
  );

  const canSubmitChat =
    !isChatSubmitting && !isChatLoading && chatInput.trim().length > 0;

  const handleTabChange = useCallback((value: string) => {
    if (value === "chat" || value === "recipes") {
      setActiveTab(value);
    }
  }, []);

  return (
    <Card className="border-brand-accent-200/70 via-background to-brand-accent-50/25 gap-4 from-white">
      <CardHeader className="gap-1">
        <CardTitle>献立サポート</CardTitle>
        <CardDescription>
          チャットで相談し、提案された献立履歴を確認できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-brand-main-50/70 grid w-full grid-cols-2">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-brand-main-500 data-[state=active]:text-white"
            >
              チャットBOT
            </TabsTrigger>
            <TabsTrigger
              value="recipes"
              className="data-[state=active]:bg-brand-main-500 data-[state=active]:text-white"
            >
              提案した献立履歴
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4 space-y-4">
            {chatError ? (
              <InlineError
                message={chatError}
                onRetry={() => {
                  void loadChatMessages();
                }}
                disabled={isChatLoading}
              />
            ) : null}

            <ScrollArea className="border-brand-accent-200/70 h-80 rounded-md border bg-white/80 p-3">
              {isChatLoading ? (
                <ChatListSkeleton />
              ) : chatMessages.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  まだ会話履歴がありません。メッセージを送信して開始してください。
                </p>
              ) : (
                <div className="space-y-2 pr-2">
                  {chatMessages.map((message, index) => {
                    if (message.role === "user") {
                      return (
                        <article
                          key={`${message.role}-${index}`}
                          className="bg-brand-main-100 text-brand-main-900 ml-auto max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed shadow-xs"
                        >
                          <p>{message.content}</p>
                        </article>
                      );
                    }

                    return (
                      <section
                        key={`${message.role}-${index}`}
                        className="mr-auto max-w-[90%] space-y-2"
                      >
                        <article className="border-brand-main-100 bg-brand-main-50/15 rounded-xl border px-3 py-2 text-sm leading-relaxed shadow-xs">
                          <p>{message.content}</p>
                        </article>
                        {message.recipes.length > 0 ? (
                          <div className="border-brand-accent-200/70 bg-brand-accent-50/15 rounded-xl border px-3 py-2">
                            <p className="text-muted-foreground mb-2 text-xs">
                              提案献立
                            </p>
                            <RecipeAccordion
                              recipes={message.recipes}
                              valuePrefix={`chat-message-${index}`}
                            />
                          </div>
                        ) : null}
                      </section>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <form className="space-y-2" onSubmit={handleSubmitChat}>
              <Label htmlFor="pantry-chat-input">メッセージ</Label>
              <Textarea
                id="pantry-chat-input"
                value={chatInput}
                onChange={(event) => {
                  setChatInput(event.target.value);
                }}
                placeholder="例: 冷蔵庫にある食材で作れる夕飯を提案して"
                className="focus-visible:border-brand-main-400 focus-visible:ring-brand-main-300/40"
                disabled={isChatSubmitting}
              />
              {chatSubmitError ? (
                <InlineError message={chatSubmitError} />
              ) : null}
              <Button
                type="submit"
                className="bg-brand-main-500 hover:bg-brand-main-600 text-white"
                disabled={!canSubmitChat}
              >
                {isChatSubmitting ? (
                  <Loader2 className="mr-1 size-4 animate-spin" />
                ) : null}
                送信
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="recipes" className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500/40 bg-gray-100/70 p-0 text-gray-700"
                onClick={() => {
                  void loadRecipeHistory();
                }}
                disabled={isRecipeHistoryLoading}
                aria-label="履歴を更新"
                title="履歴を更新"
              >
                <IoReload />
              </Button>
            </div>

            {recipeHistoryError ? (
              <InlineError
                message={recipeHistoryError}
                onRetry={() => {
                  void loadRecipeHistory();
                }}
                disabled={isRecipeHistoryLoading}
              />
            ) : null}

            {isRecipeHistoryLoading ? (
              <RecipeListSkeleton />
            ) : recipeHistory.length === 0 ? (
              <p className="text-muted-foreground border-brand-accent-200/70 bg-brand-accent-50/30 rounded-md border border-dashed p-3 text-sm">
                まだ献立提案の履歴がありません。
              </p>
            ) : (
              <RecipeAccordion
                recipes={recipeHistory}
                valuePrefix="recipe-history"
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
