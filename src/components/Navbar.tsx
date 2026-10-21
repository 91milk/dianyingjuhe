"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, Camera, Clock, Film, Search, Server } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onOpenAiChat: () => void;
  onOpenVisionSearch: () => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiChat,
  onOpenVisionSearch,
  onOpenHistory,
}) => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/category?q=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121214]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* 品牌 LOGO */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#ffcf32] flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                懂片<span className="text-[#ffcf32]">AI</span>
              </span>
              <span className="text-[10px] text-zinc-400 tracking-wider">智能影视聚合</span>
            </div>
          </Link>

          {/* 导航链接 */}
          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* 搜索栏 */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden sm:flex items-center relative"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索电影、电视剧、演员，或点击右侧 AI 模糊找片..."
            className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-[#ffcf32] rounded-full pl-9 pr-10 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden transition"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
        </form>

        {/* 功能按钮群 (核心模块化入口) */}
        <div className="flex items-center gap-2">
          {/* 识图搜片 */}
          {siteConfig.modules.enableVisionSearch && (
            <button
              onClick={onOpenVisionSearch}
              className="p-2 text-zinc-300 hover:text-[#ffcf32] hover:bg-zinc-800/80 rounded-xl transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="以图搜片 / 剧照识片"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden lg:inline">以图识片</span>
            </button>
          )}

          {/* 观看历史 */}
          {siteConfig.modules.enableHistory && (
            <button
              onClick={onOpenHistory}
              className="p-2 text-zinc-300 hover:text-[#ffcf32] hover:bg-zinc-800/80 rounded-xl transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="播放历史"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden lg:inline">历史</span>
            </button>
          )}
          {/* 资源站管理后台 */}
          <Link
            href="/admin/resources"
            className="p-2 text-zinc-300 hover:text-[#ffcf32] hover:bg-zinc-800/80 rounded-xl transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="采集资源站管理"
          >
            <Server className="w-4 h-4" />
            <span className="hidden lg:inline">资源库</span>
          </Link>
          {/* AI 找片 (醒目高光按钮) */}
          {siteConfig.modules.enableAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ffcf32] hover:bg-[#ffe066] text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>懂片 AI 找片</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
