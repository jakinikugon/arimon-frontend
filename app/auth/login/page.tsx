import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="bg-brand-main-50 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <LoginForm />
    </main>
  );
}
