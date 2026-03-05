"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";

import { patchBuyersMe } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { Allergen, Buyer } from "@/types/domain";

import { ALLERGEN_DATA } from "@/constants/allergen";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { AllergenToggleGroup } from "./AllergenToggleGroup";

const ALLERGEN_VALUES = Object.keys(ALLERGEN_DATA) as [Allergen, ...Allergen[]];

const updateProfileSchema = z.object({
  buyerName: z
    .string()
    .trim()
    .min(1, "ユーザー名を入力してください")
    .max(50, "ユーザー名は50文字以内で入力してください"),
  allergens: z.array(z.enum(ALLERGEN_VALUES)),
  prompt: z
    .string()
    .trim()
    .max(200, "システムプロンプトは200文字以内で入力してください"),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

interface SettingFormDialogProps {
  currentSetting: Buyer["setting"] | null;
  disabled?: boolean;
  setSettingsUpdateTrigger: Dispatch<SetStateAction<number>>;
}

export function SettingFormDialog({
  currentSetting,
  disabled,
  setSettingsUpdateTrigger,
}: SettingFormDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      buyerName: "",
      allergens: [],
      prompt: "",
    },
  });

  useEffect(() => {
    if (!currentSetting) return;
    // Dialogを開くたびにフォームの内容をcurrentSettingでリセットする
    form.reset({
      buyerName: currentSetting.buyerName,
      allergens: currentSetting.allergens,
      prompt: currentSetting.prompt,
    });
  }, [currentSetting, form, open]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await patchBuyersMe(
        values.buyerName,
        values.allergens,
        values.prompt.trim() === "" ? undefined : values.prompt,
      );
      setSettingsUpdateTrigger((prev) => prev + 1);
      setOpen(false);
    } catch {
      setSubmitError("プロフィール更新に失敗しました。");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || !currentSetting}
          onClick={() => setOpen(true)}
          className="h-10 w-10 rounded-full"
        >
          <MdEdit className="m-auto" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">プロフィール編集</DialogTitle>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="buyerName">ユーザー名</Label>
            <Input id="buyerName" {...form.register("buyerName")} />
            {form.formState.errors.buyerName && (
              <p className="text-destructive text-xs">
                {form.formState.errors.buyerName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>アレルゲン</Label>
            <p className="text-xs text-gray-400">
              アレルゲン情報はレシピ提案の精度向上に役立ちます
            </p>
            <Controller
              name="allergens"
              control={form.control}
              render={({ field }) => (
                <AllergenToggleGroup
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {form.formState.errors.allergens && (
              <p className="text-destructive text-xs">
                {form.formState.errors.allergens.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="prompt">その他</Label>
            <p className="text-xs text-gray-400">
              レシピ提案の際に追加で伝えたい情報を設定できます
            </p>
            <Textarea id="prompt" rows={4} {...form.register("prompt")} />
            {form.formState.errors.prompt && (
              <p className="text-destructive text-xs">
                {form.formState.errors.prompt.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-destructive text-xs">{submitError}</p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              size="sm"
              disabled={form.formState.isSubmitting}
            >
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
