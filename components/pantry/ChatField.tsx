"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

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
} from "./localMockApi";

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

export function ChatField() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [chatInput, setChatInput] = useState("");

  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isRecipesLoading, setIsRecipesLoading] = useState(true);
  const [isChatSubmitting, setIsChatSubmitting] = useState(false);

  const [chatError, setChatError] = useState<string | null>(null);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  const [chatSubmitError, setChatSubmitError] = useState<string | null>(null);

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

  const loadRecipes = useCallback(async () => {
    setIsRecipesLoading(true);
    setRecipesError(null);
    try {
      const response = await getBuyersMeChatRecipes();
      setRecipes(response);
    } catch {
      setRecipesError("献立履歴の取得に失敗しました。");
    } finally {
      setIsRecipesLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.allSettled([loadChatMessages(), loadRecipes()]);
  }, [loadChatMessages, loadRecipes]);

  const handleSubmitChat = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const content = chatInput.trim();
      if (!content) {
        return;
      }

      setIsChatSubmitting(true);
      setChatSubmitError(null);

      try {
        const response = await postBuyersMeChatMessages(content);
        setChatMessages(response.messages);
        setChatInput("");

        try {
          const latestRecipes = await getBuyersMeChatRecipes();
          setRecipes(latestRecipes);
          setRecipesError(null);
        } catch {
          setRecipesError(
            "献立履歴の同期に失敗しました。履歴タブから再読み込みできます。",
          );
        }
      } catch {
        setChatSubmitError("メッセージ送信に失敗しました。");
      } finally {
        setIsChatSubmitting(false);
      }
    },
    [chatInput],
  );

  const canSubmitChat =
    !isChatSubmitting && !isChatLoading && chatInput.trim().length > 0;

  return (
    <Card className="gap-4">
      <CardHeader className="gap-1">
        <CardTitle>献立サポート</CardTitle>
        <CardDescription>
          チャットで相談し、提案された献立履歴を確認できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">チャットBOT</TabsTrigger>
            <TabsTrigger value="recipes">提案した献立履歴</TabsTrigger>
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

            <ScrollArea className="h-80 rounded-md border p-3">
              {isChatLoading ? (
                <ChatListSkeleton />
              ) : chatMessages.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  まだ会話履歴がありません。メッセージを送信して開始してください。
                </p>
              ) : (
                <div className="space-y-2 pr-2">
                  {chatMessages.map((message, index) => (
                    <article
                      key={`${message.role}-${index}`}
                      className={cn(
                        "max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed shadow-xs",
                        message.role === "user"
                          ? "bg-brand-main-100 text-brand-main-900 ml-auto"
                          : "bg-muted mr-auto border",
                      )}
                    >
                      <p>{message.content}</p>
                      {message.role === "assistant" &&
                      message.recipes.length > 0 ? (
                        <p className="mt-2 text-xs opacity-80">
                          この返信には {message.recipes.length}{" "}
                          件の献立候補が含まれます
                        </p>
                      ) : null}
                    </article>
                  ))}
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
                disabled={isChatSubmitting}
              />
              {chatSubmitError ? (
                <InlineError message={chatSubmitError} />
              ) : null}
              <Button type="submit" disabled={!canSubmitChat}>
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
                onClick={() => {
                  void loadRecipes();
                }}
                disabled={isRecipesLoading}
              >
                履歴を更新
              </Button>
            </div>

            {recipesError ? (
              <InlineError
                message={recipesError}
                onRetry={() => {
                  void loadRecipes();
                }}
                disabled={isRecipesLoading}
              />
            ) : null}

            {isRecipesLoading ? (
              <RecipeListSkeleton />
            ) : recipes.length === 0 ? (
              <p className="text-muted-foreground rounded-md border border-dashed p-3 text-sm">
                まだ献立提案の履歴がありません。
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {recipes.map((recipe, index) => (
                  <AccordionItem
                    key={`${recipe.title}-${index}`}
                    value={`recipe-${index}`}
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
                        {recipe.materials.map((material, materialIndex) => (
                          <li
                            key={`${recipe.title}-${material.query}-${materialIndex}`}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-md border px-3 py-2",
                              material.inPantry
                                ? "border-brand-accent-300 bg-brand-accent-50"
                                : "bg-muted/40",
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {material.inPantry ? (
                                <CheckCircle2 className="mt-0.5 size-4 text-green-700" />
                              ) : (
                                <XCircle className="mt-0.5 size-4 text-gray-500" />
                              )}
                              <div>
                                <p className="text-sm font-medium">
                                  {material.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  検索語: {material.query}
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
                              {material.inPantry
                                ? "冷蔵庫にあり"
                                : "買い足し候補"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
