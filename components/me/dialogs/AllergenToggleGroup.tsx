"use client";

import type { Allergen } from "@/types/domain";

import { ALLERGEN_DATA } from "@/constants/allergen";

import { Button } from "@/components/ui/button";

const ALLERGEN_ENTRIES = Object.entries(ALLERGEN_DATA) as Array<
  [Allergen, string]
>;

interface AllergenToggleGroupProps {
  value: Allergen[];
  onChange: (next: Allergen[]) => void;
}

export function AllergenToggleGroup({
  value,
  onChange,
}: AllergenToggleGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALLERGEN_ENTRIES.map(([allergen, label]) => {
        const selected = value.includes(allergen);
        return (
          <Button
            key={allergen}
            type="button"
            size="xs"
            variant={selected ? "default" : "outline"}
            className={selected ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            onClick={() => {
              if (selected) {
                onChange(value.filter((entry) => entry !== allergen));
                return;
              }
              onChange([...value, allergen]);
            }}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
