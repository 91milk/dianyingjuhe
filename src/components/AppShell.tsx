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

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 独立管理后台：完全脱离前台外壳（不渲染前台导航栏、前台页脚及AI浮动球）
  if (pathname?.startsWith("/admin")) {
    return <div className="min-h-screen bg-[#090a0f] text-zinc-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-zinc-100 flex flex-col selection:bg-[#ffcf32] selection:text-black">
      {/* 顶部极速路由跳转指示条 */}
      <NavigationProgressBar />

      {/* 顶部导航 */}
      <Navbar
        onOpenAiChat={() => setIsAiOpen(true)}
        onOpenVisionSearch={() => setIsVisionOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* 页面主内容 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">{children}</main>

      {/* 底部信息 */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {siteConfig.name} · 基于 AI 驱动的影视聚合助手</p>
          <div className="flex items-center gap-3 sm:gap-4 text-zinc-400 text-xs">
            <span>支持多源播放</span>
            <span>·</span>
            <span>AI 对话找片</span>
            <span>·</span>
            <span>以图识片</span>
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

      {/* 浮动右下角 AI 快捷召唤球 */}
      {siteConfig.modules.enableAiChat && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 bg-[#ffcf32] hover:bg-[#ffe066] text-black font-bold px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="流量君 AI 找片"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
          <span className="text-xs">流量君 AI 找片</span>
        </button>
      )}

      {/* 模态弹窗与抽屉挂载 */}
      <AiChatDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <ImageSearchModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};
