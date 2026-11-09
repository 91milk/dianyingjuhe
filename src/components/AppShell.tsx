"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { AiChatDrawer } from "@/modules/ai-chat/components/AiChatDrawer";
import { ImageSearchModal } from "@/modules/ai-vision/components/ImageSearchModal";
import { HistoryDrawer } from "@/modules/user/components/HistoryDrawer";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { NavigationProgressBar } from "./NavigationProgressBar";
import { TemplateProvider, useTemplate, SiteTemplate } from "@/context/TemplateContext";
import { LocaleProvider, useLocale } from "@/i18n/LocaleContext";
import { SupportedLocale } from "@/i18n/config";

const AppShellInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { template, setTemplate, isModern } = useTemplate();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 独立管理后台：完全脱离前台外壳（不渲染前台导航栏、前台页脚及AI浮动球）
  if (pathname?.startsWith("/admin")) {
    return <div className="min-h-screen bg-[#090a0f] text-zinc-100">{children}</div>;
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isModern
          ? "bg-[#080a0b] text-[#f2efe9] selection:bg-[#ef4b43] selection:text-white"
          : "bg-[#0d0d0f] text-zinc-100 selection:bg-[#ffcf32] selection:text-black"
      }`}
    >
      {/* 顶部极速路由跳转指示条 */}
      <NavigationProgressBar />

      {/* 顶部导航 */}
      <Navbar
        onOpenAiChat={() => setIsAiOpen(true)}
        onOpenVisionSearch={() => setIsVisionOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* 页面主内容 */}
      <main
        className={`flex-1 w-full mx-auto ${
          isModern
            ? "max-w-[1440px] px-4 py-5 sm:px-6 sm:py-8 lg:px-10"
            : "max-w-7xl px-3 sm:px-4 py-4 sm:py-6"
        }`}
      >
        {children}
      </main>

      {/* 底部信息 */}
      {isModern ? (
        <footer className="mt-16 border-t border-white/10 bg-[#080a0b] py-10 text-xs text-[#777875]">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 px-4 sm:flex-row sm:items-end sm:px-6 lg:px-10">
            <div>
              <p className="text-lg font-black tracking-[-0.04em] text-[#f2efe9]">
                流量君 <span className="text-[#ef4b43]">AI</span>
              </p>
              <p className="mt-2">© 2026 {siteConfig.name} · 基于 AI 驱动的影视发现平台</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[#9c9b98]">
              <span>多源播放</span>
              <span>AI 对话找片</span>
              <span>以图识片</span>
              <button
                type="button"
                onClick={() => setTemplate("classic")}
                className="text-amber-400 hover:text-amber-300 transition cursor-pointer font-medium"
              >
                切换至经典版
              </button>
              <Link
                href="/admin/login"
                className="text-[#777875] transition hover:text-[#f2efe9]"
                title="管理入口"
              >
                管理
              </Link>
            </div>
          </div>
        </footer>
      ) : (
        <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 {siteConfig.name} · 基于 AI 驱动的影视聚合助手</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-zinc-400 text-xs">
              <span>支持多源播放</span>
              <span>·</span>
              <span>AI 对话找片</span>
              <span>·</span>
              <span>以图识片</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => setTemplate("modern")}
                className="text-[#ef4b43] hover:text-[#ff6a63] font-medium transition cursor-pointer"
              >
                体验先锋版
              </button>
              <span>·</span>
              <Link
                href="/admin/login"
                className="text-zinc-600 hover:text-zinc-400 transition"
                title="管理入口"
              >
                管理
              </Link>
            </div>
          </div>
        </footer>
      )}

      {/* 全局悬浮 AI 找片入口 */}
      {siteConfig.modules.enableAiChat && (
        <button
          type="button"
          onClick={() => setIsAiOpen(true)}
          className={`fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 rounded-full font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isModern
              ? "border border-white/10 bg-[#ef4b43] hover:bg-[#ff5a52] text-white px-4 py-3 text-xs shadow-black/40"
              : "bg-[#ffcf32] hover:bg-[#ffe066] text-black px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-amber-500/30"
          }`}
          title="流量君 AI 找片"
        >
          <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${isModern ? "" : "fill-black"}`} />
          <span className="text-xs">流量君 AI 找片</span>
        </button>
      )}

      {/* 弹窗抽屉群 */}
      <AiChatDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <ImageSearchModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};

export const AppShell: React.FC<{
  initialTemplate?: SiteTemplate;
  initialLocale?: SupportedLocale;
  children: React.ReactNode;
}> = ({ initialTemplate, initialLocale, children }) => {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <TemplateProvider initialTemplate={initialTemplate}>
        <AppShellInner>{children}</AppShellInner>
      </TemplateProvider>
    </LocaleProvider>
  );
};
