import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: `${siteConfig.shortName} - 智能影视聚合与AI找片`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-[#0d0d0f] text-zinc-100 antialiased selection:bg-[#ffcf32] selection:text-black">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
