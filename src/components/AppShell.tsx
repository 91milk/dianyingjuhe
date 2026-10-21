"use client";

import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { AiChatDrawer } from "@/modules/ai-chat/components/AiChatDrawer";
import { ImageSearchModal } from "@/modules/ai-vision/components/ImageSearchModal";
import { HistoryDrawer } from "@/modules/user/components/HistoryDrawer";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-zinc-100 flex flex-col selection:bg-[#ffcf32] selection:text-black">
      {/* 顶部导航 */}
      <Navbar
        onOpenAiChat={() => setIsAiOpen(true)}
        onOpenVisionSearch={() => setIsVisionOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* 页面主内容 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>

      {/* 底部信息 */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {siteConfig.name} · 基于 AI 驱动的影视聚合助手</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>支持多源播放</span>
            <span>·</span>
            <span>AI 对话找片</span>
            <span>·</span>
            <span>以图识片</span>
          </div>
        </div>
      </footer>

      {/* 浮动右下角 AI 快捷召唤球 */}
      {siteConfig.modules.enableAiChat && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-[#ffcf32] hover:bg-[#ffe066] text-black font-bold px-4 py-3 rounded-full shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 fill-black animate-spin-slow" />
          <span className="text-xs">懂片 AI 找片</span>
        </button>
      )}

      {/* 模态弹窗与抽屉挂载 */}
      <AiChatDrawer isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <ImageSearchModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};
