"use client";

import { useEffect } from "react";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FiSearch } from "react-icons/fi";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { SortKey } from "@/types/domain";

import { formatYen } from "@/lib/formatter";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const SEARCHBOX_PRICE_MAX_LIMIT = 3000;

const searchboxSchema = z.object({
  q: z
    .string()
    .trim()
    .max(50, "商品名は50文字以内で入力してください")
    .optional(),
  priceMax: z
    .number()
    .int()
    .min(0, "価格上限は0円以上で入力してください")
    .max(
      SEARCHBOX_PRICE_MAX_LIMIT,
      `価格上限は${formatYen(SEARCHBOX_PRICE_MAX_LIMIT)}以下で入力してください`,
    ),
  sort: z.enum(["price-low", "price-high"]),
});

export type SearchboxFormValues = z.infer<typeof searchboxSchema>;

export type ItemSearchConditions = {
  q?: string;
  priceMax?: number;
  sort: SortKey;
};

const SEARCHBOX_DEFAULT_VALUES: SearchboxFormValues = {
  q: "",
  priceMax: SEARCHBOX_PRICE_MAX_LIMIT,
  sort: "price-low",
};

const SORT_OPTIONS: SortKey[] = ["price-low", "price-high"];
const SORT_LABELS: Record<SortKey, string> = {
  "price-low": "価格が安い順",
  "price-high": "価格が高い順",
};

interface SearchboxProps {
  defaultValues?: Partial<SearchboxFormValues>;
  isSubmitting?: boolean;
  onSearch: (conditions: ItemSearchConditions) => void;
}

export function Searchbox({
  defaultValues,
  isSubmitting = false,
  onSearch,
}: SearchboxProps) {
  const mergedDefaultValues: SearchboxFormValues = useMemo(
    () => ({
      ...SEARCHBOX_DEFAULT_VALUES,
      ...defaultValues,
    }),
    [defaultValues],
  );
  const form = useForm<SearchboxFormValues>({
    resolver: zodResolver(searchboxSchema),
    defaultValues: mergedDefaultValues,
  });
  const priceMax = useWatch({ control: form.control, name: "priceMax" });

  useEffect(() => {
    form.reset(mergedDefaultValues);
  }, [form, mergedDefaultValues]);

  const handleSubmit = form.handleSubmit((values) => {
    onSearch({
      q: values.q?.trim() === "" ? undefined : values.q?.trim(),
      priceMax: values.priceMax,
      sort: values.sort,
    });
  });

  const handleReset = () => {
    form.reset(SEARCHBOX_DEFAULT_VALUES);
    onSearch({
      q: undefined,
      priceMax: SEARCHBOX_DEFAULT_VALUES.priceMax,
      sort: SEARCHBOX_DEFAULT_VALUES.sort,
    });
  };

  return (
    <form
      className="mb-3 space-y-2 rounded-md border bg-white p-2 text-gray-700"
      onSubmit={handleSubmit}
    >
      <div className="relative">
        <FiSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
        <Input
          {...form.register("q")}
          className="h-8 pl-8 text-xs"
          placeholder="商品名で検索"
          aria-label="商品名で検索"
        />
      </div>
      {form.formState.errors.q && (
        <p className="text-destructive mt-1 text-xs">
          {form.formState.errors.q.message}
        </p>
      )}

      <Accordion type="single" collapsible className="rounded-md border px-2">
        <AccordionItem value="detail" className="border-b-0">
          <AccordionTrigger className="py-2 text-xs">
            詳細検索条件
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs">最高価格</p>
                  <p className="text-xs font-semibold">{formatYen(priceMax)}</p>
                </div>
                <Controller
                  name="priceMax"
                  control={form.control}
                  render={({ field }) => (
                    <Slider
                      min={0}
                      max={SEARCHBOX_PRICE_MAX_LIMIT}
                      step={50}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0] ?? 0)}
                      aria-label="最高価格"
                    />
                  )}
                />
                {form.formState.errors.priceMax && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.priceMax.message}
                  </p>
                )}
              </div>

              <Controller
                name="sort"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col items-start space-y-1">
                    <Label htmlFor="sort" className="text-xs">
                      並び替え
                    </Label>
                    <Combobox
                      items={SORT_OPTIONS}
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as SortKey)
                      }
                      itemToStringLabel={(item) => SORT_LABELS[item]}
                      id="sort"
                    >
                      <ComboboxInput
                        className="h-8 text-xs"
                        placeholder="並び替え"
                        aria-label="並び替え"
                      />
                      <ComboboxContent>
                        <ComboboxList>
                          {SORT_OPTIONS.map((option) => (
                            <ComboboxItem key={option} value={option}>
                              {SORT_LABELS[option]}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleReset}>
          リセット
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          検索
        </Button>
      </div>
    </form>
  );
}
