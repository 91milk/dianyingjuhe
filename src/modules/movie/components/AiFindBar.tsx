"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Search, Zap, Bot, MessageSquare } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const QUICK_PROMPTS = [
  { label: "🧩 烧脑反转悬疑", query: "推荐几部结局超级大反转、高智商博弈的烧脑悬疑电影", fastKeyword: "悬疑" },
  { label: "🍱 爆笑下饭神剧", query: "推荐几部超级轻松爆笑、适合干饭看的搞笑喜剧", fastKeyword: "喜剧" },
  { label: "🔥 绝地逆袭爽剧", query: "有没有节奏飞起、打脸逆袭的高能热门微短剧？", fastKeyword: "逆袭" },
  { label: "🌌 硬核时空科幻", query: "喜欢星际穿越、探索未知宇宙和黑洞的硬科幻大片", fastKeyword: "科幻" },
  { label: "🌙 午夜高分放映室", query: "适合深夜独自一人看的赛博霓虹或治愈孤独高分电影", fastKeyword: "经典" },
  { label: "🌸 治愈人间暖片", query: "推荐像夏目友人帐或吉卜力一样温暖治愈心灵的作品", fastKeyword: "治愈" },
];

export const AiFindBar: React.FC<{ className?: string }> = ({ className = "" }) => {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [mode, setMode] = useState<"fast" | "smart">("smart");
  const [inputVal, setInputVal] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    if (mode === "smart") {
      // 懂片 AI 智能对话找片：唤起全局 AI 助手直接理解语义并召回
      window.dispatchEvent(
        new CustomEvent("dianyingjuhe:open-ai-chat", {
          detail: { prompt: query },
        })
      );
    } else {
      // 极速直搜：直奔分类搜索结果页
      router.push(`/category?q=${encodeURIComponent(query)}`);
    }
  };

  const handlePromptClick = (p: typeof QUICK_PROMPTS[0]) => {
    if (mode === "smart") {
      setInputVal(p.query);
      window.dispatchEvent(
        new CustomEvent("dianyingjuhe:open-ai-chat", {
          detail: { prompt: p.query },
        })
      );
    } else {
      setInputVal(p.fastKeyword);
      router.push(`/category?q=${encodeURIComponent(p.fastKeyword)}`);
    }
  };

  return (
    <div
      className={`relative my-4 sm:my-8 p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/20 border border-amber-500/25 shadow-2xl overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* 氛围流光 */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#ffcf32]/10 rounded-full blur-3xl pointer-events-none" />

      {/* 顶部双模式选择器与标语 */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-xl bg-gradient-to-br from-amber-400 to-[#ffcf32] text-black shadow-md shadow-amber-500/20">
            <Sparkles className="w-4 h-4 fill-black" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              {locale === "zh-CN" ? "懂片 AI · 智能找片中心" : locale === "ja-JP" ? "映画AI · スマート作品検索" : "DongPian AI · Smart Cinema Assistant"}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-[#ffcf32] border border-amber-400/30">
                {mode === "smart" ? "AI 模式" : "极速直搜"}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {mode === "smart"
                ? (locale === "zh-CN" ? "智能理解剧情描述、观影诉求与情绪，支持连续追问" : locale === "ja-JP" ? "あらすじや気分を理解し、ぴったりの作品をおすすめ" : "Understands plot descriptions, emotions & natural language")
                : (locale === "zh-CN" ? "毫秒级全网资源库直达 · 精准定位片名、导演与演职员" : locale === "ja-JP" ? "作品名・監督・キャストを高速検索" : "Instant search across all aggregated sources")}
            </p>
          </div>
        </div>

        {/* 模式切换胶囊 */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-950/80 border border-zinc-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode("smart")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "smart"
                ? "bg-[#ffcf32] text-black shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{locale === "zh-CN" ? "懂片 AI 找片" : locale === "ja-JP" ? "AI レコメンド" : "AI Smart"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("fast")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              mode === "fast"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{locale === "zh-CN" ? "极速直搜" : locale === "ja-JP" ? "高速検索" : "Fast Search"}</span>
          </button>
        </div>
      </div>

      {/* 核心搜索框 */}
      <form onSubmit={handleSearch} className="relative z-10 mt-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              mode === "smart"
                ? (locale === "zh-CN"
                    ? "输入剧情细节或诉求（例：男主被冤枉进监狱挖地道逃跑、结局大反转高分悬疑...）"
                    : locale === "ja-JP"
                    ? "あらすじや観たい作品の雰囲気を入力..."
                    : "Describe a plot or mood (e.g. wrongfully imprisoned man digs a tunnel to escape)...")
                : (locale === "zh-CN"
                    ? "输入电影、剧集、短剧名或演员导演，秒级直达..."
                    : locale === "ja-JP"
                    ? "作品名、監督、キャスト名で即座に検索..."
                    : "Enter title, actor or director for instant stream...")
            }
            className="w-full pl-11 pr-28 py-3.5 sm:py-4 rounded-2xl bg-zinc-950/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-hidden focus:border-[#ffcf32] focus:ring-2 focus:ring-[#ffcf32]/20 transition-all shadow-inner"
          />
          {mode === "smart" ? (
            <Bot className="w-4 h-4 text-amber-400 absolute left-4 pointer-events-none" />
          ) : (
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
          )}

          <button
            type="submit"
            className="absolute right-2 px-4 py-2 sm:py-2.5 rounded-xl bg-[#ffcf32] hover:bg-yellow-300 text-black font-extrabold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
          >
            {mode === "smart" ? (
              <>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{locale === "zh-CN" ? "AI 召回" : locale === "ja-JP" ? "AI検索" : "AI Recall"}</span>
              </>
            ) : (
              <>
                <span>{locale === "zh-CN" ? "立即直搜" : locale === "ja-JP" ? "検索" : "Search"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* 底部灵感热搜词快捷胶囊 */}
      <div className="relative z-10 mt-4 pt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-zinc-500 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          {locale === "zh-CN" ? "灵感片单：" : locale === "ja-JP" ? "おすすめテーマ：" : "Prompts:"}
        </span>
        {QUICK_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePromptClick(p)}
            className="text-[11px] px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-amber-400/50 transition cursor-pointer flex items-center gap-1 shadow-xs"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};
