import Link from "next/link";

export function LoginButton() {
  return (
    <Link href="/login">
      <button className="bg-brand-main-400 hover:bg-brand-main-600 focus:ring-brand-light rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none">
        ログイン
      </button>
    </Link>
  );
}
