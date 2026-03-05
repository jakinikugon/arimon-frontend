"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiPlus } from "react-icons/fi";

import fridgeInteriorImage from "@/public/images/pantry/fridge-interior.png";
import { Loader2, Trash2, XCircle } from "lucide-react";
import Image from "next/image";

import type { ItemCategory, PantryItem, PantryItemId } from "@/types/domain";
import type { JanCode } from "@/types/utility/scalars";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { JanCodeScannerDialog } from "./JanCodeScannerDialog";
import {
  localDeleteBuyersMePantry as deleteBuyersMePantry,
  localGetBuyersMePantry as getBuyersMePantry,
  localGetCategories as getCategories,
  localGetJan as getJan,
  localGetPantrySuggestionsQuery as getPantrySuggestionsQuery,
  localPostBuyersMePantry as postBuyersMePantry,
} from "./localMockApi";

// import {
//   deleteBuyersMePantry,
//   getBuyersMePantry,
//   getCategories,
//   getJan,
//   getPantrySuggestionsQuery,
//   postBuyersMePantry,
// } from "@/services";
// import { Loader2, Trash2, XCircle } from "lucide-react";

type PantryAddForm = {
  name: string;
  janCode: string;
  category: string;
};

type InlineErrorProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  disabled?: boolean;
};

const INITIAL_PANTRY_ADD_FORM: PantryAddForm = {
  name: "",
  janCode: "",
  category: "",
};

const PANTRY_ITEMS_PER_SHELF = 3;
const VISIBLE_FRIDGE_SHELF_COUNT = 4;

const PANTRY_CATEGORY_BADGE_STYLES = [
  "border-emerald-500/35 bg-emerald-500/15 text-emerald-700",
  "border-amber-500/40 bg-amber-500/15 text-amber-700",
  "border-sky-500/35 bg-sky-500/15 text-sky-700",
  "border-rose-500/35 bg-rose-500/15 text-rose-700",
  "border-violet-500/35 bg-violet-500/15 text-violet-700",
] as const;

function chunkPantryItems(items: PantryItem[]): PantryItem[][] {
  const shelves: PantryItem[][] = [];

  for (let index = 0; index < items.length; index += PANTRY_ITEMS_PER_SHELF) {
    shelves.push(items.slice(index, index + PANTRY_ITEMS_PER_SHELF));
  }

  return shelves;
}

function getCategoryBadgeStyle(category: string): string {
  const hash = Array.from(category).reduce((sum, character) => {
    return sum + character.charCodeAt(0);
  }, 0);

  return PANTRY_CATEGORY_BADGE_STYLES[
    hash % PANTRY_CATEGORY_BADGE_STYLES.length
  ];
}

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

function PantryListSkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-cyan-400/40 bg-gradient-to-b from-cyan-50/95 via-white/95 to-sky-100/90 p-4">
      <div className="space-y-3 rounded-2xl border border-white/80 bg-white/55 p-3 shadow-inner">
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="h-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 shadow-inner" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="h-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 shadow-inner" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="h-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 shadow-inner" />
        </div>
      </div>
    </div>
  );
}

type PantryChipProps = {
  item: PantryItem;
  compact?: boolean;
  isDeleting: boolean;
  disableDelete: boolean;
  onDelete: (pantryItemId: PantryItemId) => void;
};

function PantryChip({
  item,
  compact = false,
  isDeleting,
  disableDelete,
  onDelete,
}: PantryChipProps) {
  return (
    <li
      className={cn(
        "group flex min-h-16 items-start justify-between gap-2 rounded-lg border border-white/80 bg-white/90 p-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        compact ? "min-h-14 p-2" : "p-2.5",
      )}
    >
      <div className="min-w-0 space-y-1">
        <p
          className={cn(
            "truncate font-semibold text-slate-700",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {item.name}
        </p>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-1.5 py-0.5 font-medium",
            compact ? "text-[10px]" : "text-[11px]",
            getCategoryBadgeStyle(item.category),
          )}
        >
          {item.category}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-red-600 hover:bg-red-100/90 hover:text-red-700"
        onClick={() => {
          onDelete(item.id);
        }}
        aria-label={`${item.name}を削除`}
        disabled={isDeleting || disableDelete}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
      </Button>
    </li>
  );
}

export function PantryField() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [addForm, setAddForm] = useState<PantryAddForm>(
    INITIAL_PANTRY_ADD_FORM,
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [isPantryLoading, setIsPantryLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [isJanLookupLoading, setIsJanLookupLoading] = useState(false);
  const [isPantryAddSubmitting, setIsPantryAddSubmitting] = useState(false);
  const [isJanScannerOpen, setIsJanScannerOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const [pantryError, setPantryError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [janLookupError, setJanLookupError] = useState<string | null>(null);
  const [pantryAddError, setPantryAddError] = useState<string | null>(null);

  const [deletingPantryItemId, setDeletingPantryItemId] =
    useState<PantryItemId | null>(null);

  const suggestionsAbortRef = useRef<AbortController | null>(null);

  const loadPantry = useCallback(async () => {
    setIsPantryLoading(true);
    setPantryError(null);
    try {
      const response = await getBuyersMePantry();
      setPantryItems(response.items);
    } catch {
      setPantryError("冷蔵庫情報の取得に失敗しました。");
    } finally {
      setIsPantryLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setIsCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const response = await getCategories();
      setCategories(response);
    } catch {
      setCategoriesError("カテゴリ一覧の取得に失敗しました。");
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.allSettled([loadPantry(), loadCategories()]);
  }, [loadCategories, loadPantry]);

  useEffect(() => {
    const query = addForm.name.trim();

    if (!query) {
      suggestionsAbortRef.current?.abort();
      suggestionsAbortRef.current = null;
      setSuggestions([]);
      setSuggestionsError(null);
      setIsSuggestionsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const abortController = new AbortController();
      suggestionsAbortRef.current?.abort();
      suggestionsAbortRef.current = abortController;

      setIsSuggestionsLoading(true);
      setSuggestionsError(null);

      void getPantrySuggestionsQuery(query, abortController.signal)
        .then((response) => {
          if (abortController.signal.aborted) {
            return;
          }
          setSuggestions(response);
        })
        .catch(() => {
          if (abortController.signal.aborted) {
            return;
          }
          setSuggestions([]);
          setSuggestionsError(
            "サジェストの取得に失敗しました。手入力で続けられます。",
          );
        })
        .finally(() => {
          if (!abortController.signal.aborted) {
            setIsSuggestionsLoading(false);
          }
        });
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [addForm.name]);

  useEffect(() => {
    return () => {
      suggestionsAbortRef.current?.abort();
    };
  }, []);

  const fillFormFromJanCode = useCallback(async (rawJanCode: string) => {
    const janCode = rawJanCode.trim();

    if (!janCode) {
      setJanLookupError("JANコードを入力してください。");
      return;
    }

    setIsJanLookupLoading(true);
    setJanLookupError(null);

    try {
      const response = await getJan(janCode as JanCode);
      setAddForm((current) => ({
        ...current,
        janCode,
        name: response.name,
        category: response.category,
      }));
      setSuggestions([]);
      setSuggestionsError(null);
    } catch {
      setJanLookupError(
        "JANコードから情報を取得できませんでした。手入力で追加できます。",
      );
    } finally {
      setIsJanLookupLoading(false);
    }
  }, []);

  const handleSubmitPantryItem = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const name = addForm.name.trim();
      const category = addForm.category.trim();
      const janCode = addForm.janCode.trim();

      if (!name) {
        setPantryAddError("食材名は必須です。");
        return;
      }

      if (!category) {
        setPantryAddError("カテゴリは必須です。");
        return;
      }

      setIsPantryAddSubmitting(true);
      setPantryAddError(null);

      try {
        const response = await postBuyersMePantry(
          name,
          janCode ? (janCode as JanCode) : null,
          category as ItemCategory,
        );
        setPantryItems(response.items);
        setAddForm(INITIAL_PANTRY_ADD_FORM);
        setSuggestions([]);
        setSuggestionsError(null);
        setJanLookupError(null);
      } catch {
        setPantryAddError(
          "食材の追加に失敗しました。時間をおいて再試行してください。",
        );
      } finally {
        setIsPantryAddSubmitting(false);
      }
    },
    [addForm.category, addForm.janCode, addForm.name],
  );

  const handleDeletePantryItem = useCallback(
    async (pantryItemId: PantryItemId) => {
      setDeletingPantryItemId(pantryItemId);
      setPantryError(null);
      try {
        const response = await deleteBuyersMePantry(pantryItemId);
        setPantryItems(response.items);
      } catch {
        setPantryError("食材の削除に失敗しました。");
      } finally {
        setDeletingPantryItemId(null);
      }
    },
    [],
  );

  const canSubmitPantryItem =
    !isPantryAddSubmitting &&
    addForm.name.trim().length > 0 &&
    addForm.category.trim().length > 0;

  const pantryShelves = useMemo(() => {
    return chunkPantryItems(pantryItems);
  }, [pantryItems]);

  const visibleShelfItems = useMemo(() => {
    const shelves = pantryShelves.length > 0 ? [...pantryShelves] : [[]];

    while (shelves.length < VISIBLE_FRIDGE_SHELF_COUNT) {
      shelves.push([]);
    }

    return shelves;
  }, [pantryShelves]);

  return (
    <Card className="gap-4">
      <CardHeader className="gap-1">
        <CardTitle>冷蔵庫</CardTitle>
        <CardDescription>
          「冷蔵庫に食材を追加する」からフォームを開き、食材を登録できます。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsAddFormOpen((current) => !current);
            }}
            aria-expanded={isAddFormOpen}
            aria-controls="pantry-add-form"
            className="group border-brand-main-200/70 from-brand-main-50 to-brand-accent-50 hover:from-brand-main-100 hover:to-brand-accent-100 h-auto w-full justify-start rounded-2xl border bg-gradient-to-r via-white px-4 py-3 text-left shadow-sm"
          >
            <span className="flex w-full items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className="bg-brand-main text-primary-foreground flex size-9 items-center justify-center rounded-full shadow-sm">
                  <FiPlus
                    className={cn(
                      "size-4 transition-transform duration-200",
                      isAddFormOpen ? "rotate-45" : "",
                    )}
                  />
                </span>
                <span className="space-y-0.5">
                  <span className="block text-sm font-semibold">
                    {isAddFormOpen
                      ? "食材追加フォームを閉じる"
                      : "冷蔵庫に食材を追加する"}
                  </span>
                  <span className="text-muted-foreground block text-xs">
                    食材名・JANコード・カテゴリを入力して追加します。
                  </span>
                </span>
              </span>
              <span className="text-muted-foreground text-xs">
                {isAddFormOpen ? "閉じる" : "開く"}
              </span>
            </span>
          </Button>

          {isAddFormOpen ? (
            <div
              id="pantry-add-form"
              className="animate-in fade-in slide-in-from-top-2 bg-card/80 rounded-2xl border p-4 shadow-sm backdrop-blur-sm"
            >
              <form className="space-y-4" onSubmit={handleSubmitPantryItem}>
                <div className="space-y-2">
                  <Label htmlFor="pantry-name">食材名（必須）</Label>
                  <Input
                    id="pantry-name"
                    value={addForm.name}
                    onChange={(event) => {
                      setAddForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }));
                    }}
                    placeholder="例: たまねぎ"
                    autoComplete="off"
                    disabled={isPantryAddSubmitting}
                  />
                  {addForm.name.trim().length > 0 ? (
                    <div className="space-y-1">
                      {isSuggestionsLoading ? (
                        <p className="text-muted-foreground text-xs">
                          候補を取得しています...
                        </p>
                      ) : null}
                      {suggestionsError ? (
                        <InlineError
                          message={suggestionsError}
                          className="text-xs"
                        />
                      ) : null}
                      {!isSuggestionsLoading &&
                      !suggestionsError &&
                      suggestions.length > 0 ? (
                        <ul className="max-h-36 space-y-1 overflow-y-auto rounded-md border p-2">
                          {suggestions.map((suggestion) => (
                            <li key={suggestion}>
                              <button
                                type="button"
                                className="hover:bg-accent w-full rounded-md px-2 py-1 text-left text-sm transition-colors"
                                onClick={() => {
                                  setAddForm((current) => ({
                                    ...current,
                                    name: suggestion,
                                  }));
                                  setSuggestions([]);
                                }}
                                disabled={isPantryAddSubmitting}
                              >
                                {suggestion}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="space-y-2">
                    <Label htmlFor="pantry-jan-code">JANコード（任意）</Label>
                    <Input
                      id="pantry-jan-code"
                      value={addForm.janCode}
                      onChange={(event) => {
                        setAddForm((current) => ({
                          ...current,
                          janCode: event.target.value,
                        }));
                      }}
                      placeholder="例: 4901234567890"
                      inputMode="numeric"
                      disabled={isPantryAddSubmitting || isJanLookupLoading}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsJanScannerOpen(true);
                    }}
                    disabled={isPantryAddSubmitting || isJanLookupLoading}
                  >
                    JANコードを読み取る
                  </Button>
                </div>

                {janLookupError ? (
                  <InlineError message={janLookupError} />
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="pantry-category">カテゴリ（必須）</Label>
                  <select
                    id="pantry-category"
                    value={addForm.category}
                    onChange={(event) => {
                      setAddForm((current) => ({
                        ...current,
                        category: event.target.value,
                      }));
                    }}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                    disabled={isPantryAddSubmitting || isCategoriesLoading}
                  >
                    <option value="">カテゴリを選択してください</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {categoriesError ? (
                    <InlineError
                      message={categoriesError}
                      onRetry={() => {
                        void loadCategories();
                      }}
                      disabled={isCategoriesLoading}
                    />
                  ) : null}
                </div>

                {pantryAddError ? (
                  <InlineError message={pantryAddError} />
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={!canSubmitPantryItem}>
                    {isPantryAddSubmitting ? (
                      <Loader2 className="mr-1 size-4 animate-spin" />
                    ) : null}
                    食材を追加
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAddForm(INITIAL_PANTRY_ADD_FORM);
                      setSuggestions([]);
                      setPantryAddError(null);
                      setJanLookupError(null);
                      setSuggestionsError(null);
                    }}
                    disabled={isPantryAddSubmitting}
                  >
                    入力をクリア
                  </Button>
                </div>
              </form>
            </div>
          ) : null}
        </section>

        <section className="space-y-3" aria-live="polite">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">追加済みの食材</h2>
              <span className="text-muted-foreground rounded-full border bg-white/80 px-2 py-0.5 text-xs">
                {pantryItems.length}件
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void loadPantry();
              }}
              disabled={isPantryLoading}
            >
              再読み込み
            </Button>
          </div>

          {pantryError ? (
            <InlineError
              message={pantryError}
              onRetry={() => {
                void loadPantry();
              }}
              disabled={isPantryLoading}
            />
          ) : null}

          {isPantryLoading ? (
            <PantryListSkeleton />
          ) : (
            <div className="relative overflow-hidden rounded-[1.75rem] border border-cyan-400/45 shadow-inner">
              <Image
                src={fridgeInteriorImage}
                alt=""
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="pointer-events-none object-cover select-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-white/20" />

              <ScrollArea className="relative h-[30rem]">
                <div className="space-y-3 p-4 sm:p-5">
                  {visibleShelfItems.map((shelf, shelfIndex) => (
                    <div key={`shelf-${shelfIndex}`} className="space-y-2">
                      <ul className="grid min-h-24 content-start gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {shelf.length > 0 ? (
                          shelf.map((item) => (
                            <PantryChip
                              key={item.id}
                              item={item}
                              isDeleting={deletingPantryItemId === item.id}
                              disableDelete={deletingPantryItemId !== null}
                              onDelete={(pantryItemId) => {
                                void handleDeletePantryItem(pantryItemId);
                              }}
                            />
                          ))
                        ) : (
                          <li className="rounded-md border border-dashed border-slate-400/35 bg-white/70 px-2 py-3 text-center text-xs text-slate-500 sm:col-span-2 lg:col-span-3">
                            {pantryItems.length === 0 && shelfIndex === 0
                              ? "まだ食材が登録されていません。上の「冷蔵庫に食材を追加する」から追加してください。"
                              : "空き棚"}
                          </li>
                        )}
                      </ul>
                      <div className="h-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 shadow-inner" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </section>

        <JanCodeScannerDialog
          open={isJanScannerOpen}
          onOpenChange={setIsJanScannerOpen}
          onDetected={(janCode) => {
            void fillFormFromJanCode(janCode);
          }}
          onError={(message) => {
            setJanLookupError(message);
          }}
        />
      </CardContent>
    </Card>
  );
}
