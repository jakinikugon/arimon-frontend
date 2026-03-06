"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import type { Email, Password } from "@/types/utility/scalars";

import { login } from "@/lib/auth/login";

import { authSession } from "@/services/auth/session";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email("メールアドレスの形式で入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await login(values.email as Email, values.password as Password);
      const session = await authSession();
      router.push(session.accountType === "store" ? "/store/me" : "/me");
    } catch (error) {
      const message =
        error instanceof Error
          ? "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。"
          : "ログインに失敗しました。";
      setSubmitError(message);
    }
  });

  return (
    <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold">ログイン</h1>
      <p className="mt-1 text-sm text-gray-600">
        メールアドレスとパスワードを入力してください。
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
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
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {submitError && (
          <p className="text-destructive text-sm">{submitError}</p>
        )}

        <Button
          type="submit"
          className="bg-brand-main-400 hover:bg-brand-main-700 w-full text-white"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        アカウントをお持ちでないですか？{" "}
        <Link
          href="/auth/register"
          className="text-brand-main-400 hover:underline"
        >
          新規作成
        </Link>
      </p>
    </div>
  );
}
