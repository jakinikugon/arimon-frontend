"use client";

import type { Dispatch, SetStateAction } from "react";

import type { Allergen, Buyer } from "@/types/domain";

import { ALLERGEN_DATA } from "@/constants/allergen";

import { Marker } from "@/components/common/Marker";
import { SettingFormDialog } from "@/components/me/dialogs/SettingFormDialog";

interface AllergenListProps {
  allergens: Allergen[];
}

function AllergenDisplay({ allergens }: AllergenListProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-600">アレルゲン:</p>
      <p className="rounded-md bg-gray-50 px-3 py-2 text-sm whitespace-pre-wrap text-gray-700">
        {allergens.length > 0
          ? allergens.map((allergen) => ALLERGEN_DATA[allergen]).join(", ")
          : "なし"}
      </p>
    </div>
  );
}

interface PromptDisplayProps {
  prompt: string;
}

function PromptDisplay({ prompt }: PromptDisplayProps) {
  if (!prompt) {
    return null;
  }
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-600">その他:</p>
      <p className="rounded-md bg-gray-50 px-3 py-2 text-sm whitespace-pre-wrap text-gray-700">
        {prompt}
      </p>
    </div>
  );
}

interface SettingContainerProps {
  loading: boolean;
  profile: Buyer | null;
  setSettingsUpdateTrigger: Dispatch<SetStateAction<number>>;
}

export function SettingContainer({
  loading,
  profile,
  setSettingsUpdateTrigger,
}: SettingContainerProps) {
  return (
    <div className="space-y-4 px-5">
      <div className="flex items-center justify-between">
        <h2 className="pl-2 text-lg font-semibold text-gray-800">
          <Marker color="var(--color-brand-accent-300)">設定</Marker>
        </h2>
        <div className="-mb-2">
          <SettingFormDialog
            currentSetting={profile?.setting ?? null}
            disabled={loading || !profile}
            setSettingsUpdateTrigger={setSettingsUpdateTrigger}
          />
        </div>
      </div>

      <AllergenDisplay allergens={profile?.setting.allergens ?? []} />
      <PromptDisplay prompt={profile?.setting.prompt ?? ""} />
    </div>
  );
}
