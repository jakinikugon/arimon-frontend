"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { authSession } from "@/services/auth/session";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ChatField } from "./ChatField";
import { PantryField } from "./PantryField";

type PantryPageMode = "checking" | "authenticated" | "guest";

function PantryPreview() {
  return (
    <>
      <Card className="gap-4">
        <CardHeader className="gap-1">
          <CardTitle>冷蔵庫</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader className="gap-1">
          <CardTitle>献立サポート</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-9 w-20" />
        </CardContent>
      </Card>
    </>
  );
}

export function PantryPage() {
  const [mode, setMode] = useState<PantryPageMode>("checking");

  useEffect(() => {
    let isActive = true;

    const checkSession = async () => {
      try {
        await authSession();
        if (isActive) {
          setMode("authenticated");
        }
      } catch {
        if (isActive) {
          setMode("guest");
        }
      }
    };

    void checkSession();

    return () => {
      isActive = false;
    };
  }, []);

  const isGuest = mode === "guest";
  const isChecking = mode === "checking";

  return (
    <div className="mx-auto w-full max-w-135 p-4 pb-28 sm:p-6">
      <div className="relative">
        <div className={isGuest || isChecking ? "pointer-events-none" : ""}>
          <div className="flex flex-col gap-4">
            {mode === "authenticated" ? (
              <>
                <PantryField />
                <ChatField />
              </>
            ) : (
              <PantryPreview />
            )}
          </div>
        </div>

        {isGuest ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-gray-200/70 p-4 backdrop-blur-[1px]">
            <div className="w-full max-w-md rounded-lg border border-gray-300 bg-white/95 p-6 text-center shadow-lg">
              <p className="text-base font-semibold text-gray-900">
                この画面を利用するにはログイン又は登録を行ってください。
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Button asChild>
                  <Link href="/auth/login">ログイン</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/auth/register">新規登録</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {isChecking ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-gray-200/55 p-4 backdrop-blur-[1px]">
            <div className="rounded-md bg-white/90 px-4 py-2 text-sm text-gray-700 shadow">
              ログイン状態を確認しています...
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
