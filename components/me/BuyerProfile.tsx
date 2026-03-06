"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import type { Buyer, Reports } from "@/types/domain";

import { SquareMove2 } from "@/components/loader";
import { LogoutButton } from "@/components/me/container/LogoutButton";

import { waitMockDelay } from "@/mocks/demo/_utils";
import { getBuyersMe, getBuyersMeReports } from "@/mocks/demo/buyers";

import {
  ProfileContainer,
  PurchaseHistoryContainer,
  RescueCounter,
  SettingContainer,
} from "./container";

function isRecentWithin7Days(iso: string): boolean {
  const base = new Date();
  const target = new Date(iso);
  const diffMs = base.getTime() - target.getTime();
  return diffMs >= 0 && diffMs <= 7 * 24 * 60 * 60 * 1000;
}

export function BuyerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Buyer | null>(null);
  const [reports, setReports] = useState<Reports | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [logoutPending, setLogoutPending] = useState<boolean>(false);
  const [settingsUpdateTrigger, setSettingsUpdateTrigger] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const [buyer, buyerReports] = await Promise.all([
          getBuyersMe(),
          getBuyersMeReports(),
        ]);
        setProfile(buyer);
        setReports(buyerReports);
      } catch {
        // setErrorMessage("プロフィール情報の取得に失敗しました。");
        setProfile(null);
        setReports(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [settingsUpdateTrigger]);

  const sortedItems = useMemo(() => {
    if (!reports) return [];
    return [...reports.items].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [reports]);

  const recentItems = useMemo(
    () => sortedItems.filter((report) => isRecentWithin7Days(report.date)),
    [sortedItems],
  );
  const olderItems = useMemo(
    () => sortedItems.filter((report) => !isRecentWithin7Days(report.date)),
    [sortedItems],
  );

  const handleLogout = async () => {
    try {
      setLogoutPending(true);
      await waitMockDelay(180);
      router.push("/");
      router.refresh();
    } finally {
      setLogoutPending(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <SquareMove2 color="var(--color-gray-300)" size="2rem" />
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      ) : profile && reports ? (
        <div className="mx-2 max-w-4xl space-y-6 pt-3">
          <ProfileContainer profile={profile} />
          <RescueCounter
            count={reports?.totalCount ?? 0}
            totalDiscount={reports?.totalDiscount ?? 0}
          />
          <SettingContainer
            loading={loading}
            profile={profile}
            setSettingsUpdateTrigger={setSettingsUpdateTrigger}
          />
          <PurchaseHistoryContainer
            recentItems={recentItems}
            olderItems={olderItems}
            historyOpen={historyOpen}
            onHistoryOpenChange={setHistoryOpen}
          />
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <div className="flex flex-col items-center justify-center py-8">
            <LogoutButton
              pending={logoutPending}
              onLogout={handleLogout}
              className="w-36"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-10">
          <p className="text-sm text-gray-500">
            プロフィール情報の取得に失敗しました
          </p>
        </div>
      )}
    </div>
  );
}
