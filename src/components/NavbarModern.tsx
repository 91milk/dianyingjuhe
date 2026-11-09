"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Clock, Search, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { TemplateSwitcher } from "./TemplateSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleContext";

interface NavbarProps {
  onOpenAiChat?: () => void;
  onOpenHistory?: () => void;
  onOpenVisionSearch?: () => void;
}

export const NavbarModern: React.FC<NavbarProps> = ({
  onOpenAiChat,
  onOpenHistory,
  onOpenVisionSearch,
}) => {
  const router = useRouter();
  const { t } = useLocale();
  const [keyword, setKeyword] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/category?q=${encodeURIComponent(keyword.trim())}`);
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080a0b]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="text-xl font-black tracking-[-0.05em] text-[#f2efe9]">
            流量君 <span className="text-[#ef4b43]">AI</span>
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.24em] text-[#6f706d] xl:inline">
            Film Cinema
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#8f908d] lg:flex" aria-label="全站主导航">
          {[
            { title: t.nav.home, href: "/" },
            { title: t.nav.movie, href: "/category?type=movie" },
            { title: t.nav.tv, href: "/category?type=tv" },
            { title: t.nav.shortplay, href: "/category?type=shortplay" },
            { title: t.nav.anime, href: "/category?type=anime" },
            { title: t.nav.variety, href: "/category?type=variety" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition duration-150 hover:text-[#f2efe9]"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="relative ml-auto hidden min-w-0 max-w-md flex-1 sm:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777875]" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={t.common.searchPlaceholder}
            aria-label="搜索影片"
            className="h-10 w-full rounded-full border border-white/12 bg-white/[0.045] pl-11 pr-4 text-sm text-[#f2efe9] placeholder:text-[#6f706d] transition focus:border-[#ef4b43]/70 focus:bg-white/[0.065]"
          />
        </form>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* 语言国际化切换器 */}
          <LanguageSwitcher />

          {/* 模板切换器 */}
          <TemplateSwitcher />

          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((open) => !open)}
            className="rounded-full p-2.5 text-[#b8b7b3] transition hover:bg-white/7 hover:text-white sm:hidden"
            aria-label={isMobileSearchOpen ? "关闭搜索" : "打开搜索"}
          >
            {isMobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          {siteConfig.modules.enableVisionSearch && (
            <button
              type="button"
              onClick={onOpenVisionSearch}
              className="rounded-full p-2.5 text-[#b8b7b3] transition hover:bg-white/7 hover:text-white"
              aria-label="以图识片"
              title="以图识片"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}

          {siteConfig.modules.enableHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="rounded-full p-2.5 text-[#b8b7b3] transition hover:bg-white/7 hover:text-white"
              aria-label="播放历史"
              title="播放历史"
            >
              <Clock className="h-4 w-4" />
            </button>
          )}

          {siteConfig.modules.enableAiChat && (
            <button
              type="button"
              onClick={onOpenAiChat}
              className="ml-1 hidden items-center gap-2 rounded-full bg-[#ef4b43] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#ff5a52] md:flex"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI 找片
            </button>
          )}
        </div>
      </div>

      {isMobileSearchOpen && (
        <form onSubmit={handleSearch} className="flex gap-2 border-t border-white/10 px-4 py-3 sm:hidden">
          <label className="relative flex-1">
            <span className="sr-only">搜索影片</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777875]" />
            <input
              autoFocus
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索电影、剧集、演员"
              className="h-10 w-full rounded-full border border-white/12 bg-[#121516] pl-10 pr-3 text-sm text-white placeholder:text-[#6f706d] focus:border-[#ef4b43]"
            />
          </label>
          <button type="submit" className="rounded-full bg-[#ef4b43] px-4 text-sm font-bold text-white">
            搜索
          </button>
        </form>
      )}

      <nav className="flex gap-5 overflow-x-auto border-t border-white/[0.06] px-4 py-2 lg:hidden" aria-label="移动端导航">
        {[
          { title: t.nav.home, href: "/" },
          { title: t.nav.movie, href: "/category?type=movie" },
          { title: t.nav.tv, href: "/category?type=tv" },
          { title: t.nav.shortplay, href: "/category?type=shortplay" },
          { title: t.nav.anime, href: "/category?type=anime" },
          { title: t.nav.variety, href: "/category?type=variety" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 text-xs font-medium text-[#9c9b98] hover:text-white">
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  );
};
