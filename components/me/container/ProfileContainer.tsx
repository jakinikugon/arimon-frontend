"use client";

import type { Buyer } from "@/types/domain";

interface ProfileContainerProps {
  profile: Buyer | null;
}

export function ProfileContainer({ profile }: ProfileContainerProps) {
  return (
    <div className="space-y-1 px-5 py-3">
      <p className="text-2xl font-semibold text-gray-700">
        {profile?.setting.buyerName ?? "-"} さん
      </p>
      <p className="ml-1 text-xs text-gray-600">{profile?.id ?? "-"}</p>
    </div>
  );
}
