import { initMocks } from "@/mocks";
import { Noto_Sans_JP } from "next/font/google";

import { META_CONFIG } from "@/constants/metadata";

import { EnvConfig } from "@/lib/env";
import { createMetadata } from "@/lib/metadate";

import { Header } from "@/components/layout/header";

import "../../globals.css";

// モックを有効化
if (EnvConfig.util.enableMocks) {
  await initMocks();
}

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = createMetadata(META_CONFIG);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSans.variable}>
      <body className="flex justify-center bg-gray-100 antialiased">
        <div className="min-h-screen w-full max-w-135 bg-gray-400 shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
