"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import type { UserName } from "@/types/domain";

import { authSession } from "@/services/auth/session";

import { AccountField } from "./AccountField";
import { LoginButton } from "./LoginButton";

export function Header() {
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<UserName | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authSession();
        setIsLogin(true);
        setUserName(res.userName);
      } catch {
        setIsLogin(false);
        setUserName(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="border-brand-main-300 sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-16 w-full max-w-135 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="tracking-wide">
          <Image
            src="/images/logo/logo.png"
            alt="ありもんナビ ロゴ"
            width={120}
            height={120}
            className="mr-3 -mb-2"
          />
        </Link>
        {isLogin === true ? (
          <AccountField userName={userName} />
        ) : isLogin === false ? (
          <LoginButton />
        ) : (
          <div />
          // セッションの確認中は何も表示しない（ちらつき防止）
        )}
      </div>
    </header>
  );
}
