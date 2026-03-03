import { initMocks } from "@/mocks";
import { Geist, Geist_Mono } from "next/font/google";

import { META_CONFIG } from "@/constants/metadata";

import { EnvConfig } from "@/lib/env";
import { createMetadata } from "@/lib/metadate";

import "./globals.css";

// モックを有効化
if (EnvConfig.util.enableMocks) {
  await initMocks();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata(META_CONFIG);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
