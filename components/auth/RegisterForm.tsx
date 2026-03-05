"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import type { AccountType } from "@/types/domain";
import type { Email, Password } from "@/types/utility/scalars";

import { authRegister } from "@/services/auth/register";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  email: z.email("メールアドレスの形式で入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
  accountType: z.enum(["buyer", "store"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  buyer: "購入者",
  store: "ストア",
};

export function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      accountType: "buyer",
    },
  });

  const accountType = form.watch("accountType");

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const result = await authRegister(
        values.email as Email,
        values.password as Password,
        values.accountType,
      );
      router.push(result.accountType === "store" ? "/store/me" : "/me");
    } catch {
      setSubmitError(
        "登録に失敗しました。入力内容を確認して再度お試しください。",
      );
    }
  });

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur">
      <h1 className="text-2xl font-bold text-zinc-900">アカウント登録</h1>
      <p className="mt-1 text-sm text-zinc-600">
        メールアドレス・パスワード・種別を入力してください。
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="register-email">メールアドレス</Label>
          <Input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-destructive text-xs">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">パスワード</Label>
          <Input
            id="register-password"
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>アカウント種別</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["buyer", "store"] as const).map((type) => (
              <Button
                key={type}
                type="button"
                variant={accountType === type ? "default" : "outline"}
                className={
                  accountType === type
                    ? "bg-brand-accent-400 hover:bg-brand-accent-500 text-white"
                    : ""
                }
                onClick={() => {
                  form.setValue("accountType", type, { shouldValidate: true });
                }}
              >
                {ACCOUNT_TYPE_LABEL[type]}
              </Button>
            ))}
          </div>
        </div>

        {submitError && (
          <p className="text-destructive text-sm">{submitError}</p>
        )}

        <Button
          type="submit"
          className="bg-brand-main-400 hover:bg-brand-main-600 w-full text-white"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "登録中..." : "新規登録"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-600">
        すでにアカウントをお持ちですか？{" "}
        <Link
          href="/auth/login"
          className="text-brand-main-500 font-medium hover:underline"
        >
          ログイン
        </Link>
      </p>
    </div>
  );
}
