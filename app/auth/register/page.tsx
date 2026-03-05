import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="bg-brand-main-50 flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br px-4 py-10">
      <RegisterForm />
    </main>
  );
}
