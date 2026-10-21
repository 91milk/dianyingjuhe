"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { aiMovieService } from "../services/aiService";
import { AiMovieCard } from "./AiMovieCard";
import { Sparkles, Send, X, Bot, User, Trash2 } from "lucide-react";

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "你好！我是你的智能懂片助手。你可以用任何自然语言向我描述：\n• 想看的剧情细节（如“男主失忆被困在小镇”）\n• 当下的心情（如“下班太累了，求不带脑子的搞笑喜剧”）\n• 某部电影的看点解析或找同款佳作！",
      createdAt: 0,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = aiMovieService.getPresetPrompts();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiMovieService.generateResponse(text, messages);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "网络有点开小差，请稍后再试一次~",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* 遮罩点击关闭 */}
      <div className="flex-1" onClick={onClose} />

      {/* 抽屉主容器 */}
      <div className="w-full max-w-md h-full bg-[#141416] border-l border-zinc-800 flex flex-col shadow-2xl animate-slide-left">
        {/* 顶部标题栏 */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffcf32] flex items-center justify-center text-black font-bold shadow-md">
              <Sparkles className="w-4 h-4 fill-black" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">懂片 AI 找片助手</h3>
              <p className="text-[11px] text-zinc-400">自然语言找片 · 剧情模糊召回</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
              title="清空对话"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 消息对话区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* 头像 */}
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${
                  msg.role === "user"
                    ? "bg-zinc-700 text-white"
                    : "bg-[#ffcf32] text-black font-semibold"
                }`}
              >
                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* 内容 */}
              <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#ffcf32] text-black rounded-tr-xs font-medium"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-xs whitespace-pre-line shadow-xs"
                  }`}
                >
                  {msg.content}
                </div>

                {/* 电影卡片推荐列表 */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.recommendations.map((rec) => (
                      <AiMovieCard key={rec.movie.id} recommendation={rec} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ffcf32] text-black flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl rounded-tl-xs text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffcf32] animate-ping" />
                AI 正在全网检索高口碑影视库...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 快捷推荐提示词栏 */}
        <div className="p-2 border-t border-zinc-800/80 bg-zinc-900/30 overflow-x-auto scrollbar-none flex gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset.prompt)}
              className="text-[11px] px-2.5 py-1 bg-zinc-800/70 hover:bg-[#ffcf32] hover:text-black text-zinc-300 rounded-full shrink-0 transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* 输入框 */}
        <div className="p-3 border-t border-zinc-800 bg-[#141416]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入剧情、类型、演员或此刻心情..."
              className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-[#ffcf32] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-[#ffcf32] hover:bg-[#ffe066] disabled:opacity-40 disabled:hover:bg-[#ffcf32] text-black rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
