"use client";

import { useEffect, useMemo, useState } from "react";

import { getBuyersMe, getBuyersMeReports } from "@/services";
import { useRouter } from "next/navigation";

import type { Buyer, Reports } from "@/types/domain";

import { logout } from "@/lib/auth/logout";

import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { SquareMove2 } from "@/components/loader";
import { LogoutButton } from "@/components/me/container/LogoutButton";

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
        setProfile({
          id: "dummy" as Buyer["id"],
          setting: {
            buyerName: "ダミーユーザー",
            allergens: ["egg"] as Buyer["setting"]["allergens"],
            prompt: "lorem ipsum dolor sit amet" as Buyer["setting"]["prompt"],
          },
        });
        setReports({
          totalCount: 10,
          totalDiscount: 0,
          items: [
            {
              date: new Date().toISOString() as Reports["items"][number]["date"],
              item: {
                id: "dummy-item" as Reports["items"][number]["item"]["id"],
                name: "ダミー商品",
                imageUrl: "" as Reports["items"][number]["item"]["imageUrl"],
                price: {
                  regular: 1000,
                  discount: 800,
                },
              },
            },
            {
              date: new Date().toISOString() as Reports["items"][number]["date"],
              item: {
                id: "dummy-item" as Reports["items"][number]["item"]["id"],
                name: "ダミー商品",
                imageUrl: "" as Reports["items"][number]["item"]["imageUrl"],
                price: {
                  regular: 1000,
                  discount: 800,
                },
              },
            },
            {
              date: "2020-01-01T00:00:00Z" as Reports["items"][number]["date"],
              item: {
                id: "dummy-item-2" as Reports["items"][number]["item"]["id"],
                name: "古いダミー商品",
                imageUrl: "" as Reports["items"][number]["item"]["imageUrl"],
                price: {
                  regular: 1500,
                  discount: 1200,
                },
              },
            },
          ],
        });
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
      await logout();
      router.push("/");
      router.refresh();
    } finally {
      setLogoutPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-10">
          <SquareMove2 color="var(--color-gray-300)" size="2rem" />
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      ) : (
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
      )}
      <BottomNavigation currentPage="profile" />
    </div>
  );
}
