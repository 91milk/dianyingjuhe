"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  MessageSquare,
  Send,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Palette,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { DanmakuItem, DanmakuConfig, DEFAULT_DANMAKU_CONFIG } from "../types";

interface DanmakuOverlayProps {
  movieId?: string;
  episodeId?: string;
  currentTime: number;
  isPlaying?: boolean;
  onSendDanmu?: (danmaku: DanmakuItem) => void;
  className?: string;
}

interface ActiveDanmaku {
  uniqueId: string;
  item: DanmakuItem;
  trackTop: number; // 百分比
  createdAt: number;
}

const COLOR_PRESETS = [
  { name: "纯白", value: "#ffffff" },
  { name: "流量金", value: "#ffcf32" },
  { name: "生机绿", value: "#4ade80" },
  { name: "极光蓝", value: "#38bdf8" },
  { name: "少女粉", value: "#f472b6" },
  { name: "高能红", value: "#f87171" },
  { name: "星空紫", value: "#c084fc" },
];

const CONFIG_STORAGE_KEY = "dp_danmaku_config_v2";

export const DanmakuOverlay: React.FC<DanmakuOverlayProps> = ({
  movieId = "default",
  episodeId = "default",
  currentTime,
  isPlaying = true,
  onSendDanmu,
  className = "",
}) => {
  // 1. 用户弹幕偏好配置 (持久化到本地 localStorage)
  const [config, setConfig] = useState<DanmakuConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (saved) return { ...DEFAULT_DANMAKU_CONFIG, ...JSON.parse(saved) };
      } catch {
        // ignore
      }
    }
    return DEFAULT_DANMAKU_CONFIG;
  });

  const updateConfig = (patch: Partial<DanmakuConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // 2. 真实弹幕库 (服务端拉取 + 本地实时发射池)
  const [allDanmakus, setAllDanmakus] = useState<DanmakuItem[]>([]);
  const [activeDanmus, setActiveDanmus] = useState<ActiveDanmaku[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // 发送器状态
  const [inputText, setInputText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedType, setSelectedType] = useState<"scroll" | "top" | "bottom">("scroll");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const lastTimeRef = useRef<number>(currentTime);
  const firedIdsRef = useRef<Set<string>>(new Set());
  const trackCounterRef = useRef<number>(0);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  // 3. 切换视频或集数时：拉取服务端真实弹幕库并重置发射缓存
  useEffect(() => {
    let isMounted = true;
    firedIdsRef.current.clear();
    setActiveDanmus([]);

    async function loadDanmakus() {
      try {
        const res = await fetch(
          `/api/danmaku?movieId=${encodeURIComponent(movieId)}&episodeId=${encodeURIComponent(
            episodeId
          )}`
        );
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setAllDanmakus(data.data);
        }
      } catch (err) {
        console.warn("Failed to load real danmaku list:", err);
      }
    }

    loadDanmakus();
    return () => {
      isMounted = false;
    };
  }, [movieId, episodeId]);

  // 点击外部收起设置与调色盘面板
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsPanelRef.current && !settingsPanelRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
        setIsColorPickerOpen(false);
      }
    }
    if (isSettingsOpen || isColorPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen, isColorPickerOpen]);

  // 4. 时间轴精准同步推进 (彻底移除原先的定时无脑随机演示，按真实秒数触发)
  useEffect(() => {
    if (!isPlaying || !config.enabled || allDanmakus.length === 0) return;

    const prev = lastTimeRef.current;
    const curr = currentTime;

    // 检测用户拖动进度条跳转：差异超过 2 秒则重置已发射队列并清空当前屏幕
    if (Math.abs(curr - prev) > 2) {
      firedIdsRef.current.clear();
      setActiveDanmus([]);
      lastTimeRef.current = curr;
      return;
    }

    // 筛选当前秒数区间内未发射过的弹幕
    const matched = allDanmakus.filter((dm) => {
      if (firedIdsRef.current.has(dm.id)) return false;
      return dm.time >= Math.min(prev, curr) - 0.2 && dm.time <= Math.max(prev, curr) + 0.3;
    });

    if (matched.length > 0) {
      // 计算轨道上限
      const maxTracks = config.area === "quarter" ? 3 : config.area === "half" ? 5 : 8;

      const newActives: ActiveDanmaku[] = matched.map((item) => {
        firedIdsRef.current.add(item.id);
        const trackIdx = trackCounterRef.current % maxTracks;
        trackCounterRef.current += 1;

        // top 模式固定在上方，bottom 模式固定在下方
        let trackTop = 6 + trackIdx * 9;
        if (item.type === "top") trackTop = 6 + (trackIdx % 2) * 8;
        if (item.type === "bottom") trackTop = 68 - (trackIdx % 2) * 8;

        return {
          uniqueId: `${item.id}-${Date.now()}`,
          item,
          trackTop,
          createdAt: Date.now(),
        };
      });

      setActiveDanmus((old) => [...old.slice(-25), ...newActives]);
    }

    lastTimeRef.current = curr;
  }, [currentTime, isPlaying, config.enabled, config.area, allDanmakus]);

  // 定期清理已飘出屏幕的过期弹幕
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const ttl = (config.speed + 2) * 1000;
      setActiveDanmus((old) => old.filter((a) => now - a.createdAt < ttl));
    }, 2000);
    return () => clearInterval(timer);
  }, [config.speed]);

  // 5. 发送真实弹幕 (立刻上屏 + 异步持久化到服务端)
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const newDanmuItem: DanmakuItem = {
      id: `user_${Date.now()}`,
      movieId,
      episodeId,
      text,
      time: Math.round(currentTime * 10) / 10,
      color: selectedColor,
      type: selectedType,
      size: config.fontSize,
      user: "我",
      createdAt: Date.now(),
      likes: 0,
    };

    // 立即乐观上屏，无需等待网络往返
    const maxTracks = config.area === "quarter" ? 3 : config.area === "half" ? 5 : 8;
    const trackIdx = trackCounterRef.current % maxTracks;
    trackCounterRef.current += 1;
    let trackTop = 6 + trackIdx * 9;
    if (selectedType === "top") trackTop = 6;
    if (selectedType === "bottom") trackTop = 68;

    setActiveDanmus((old) => [
      ...old,
      {
        uniqueId: `local-${Date.now()}`,
        item: newDanmuItem,
        trackTop,
        createdAt: Date.now(),
      },
    ]);
    setAllDanmakus((prev) => [...prev, newDanmuItem]);
    firedIdsRef.current.add(newDanmuItem.id);

    // 提示
    setToastMsg("弹幕发射成功 ✨");
    setTimeout(() => setToastMsg(null), 2000);

    // 回调通知外部组件（如右侧互动剧评区同步）
    if (onSendDanmu) onSendDanmu(newDanmuItem);
    setInputText("");

    // 异步同步到服务器端持久化
    try {
      await fetch("/api/danmaku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          episodeId,
          text,
          time: newDanmuItem.time,
          color: selectedColor,
          type: selectedType,
          size: config.fontSize,
        }),
      });
    } catch (err) {
      console.warn("Failed to persist danmaku to server:", err);
    }
  };

  // 字体尺寸样式映射
  const fontSizeClass = useMemo(() => {
    if (config.fontSize === "sm") return "text-xs";
    if (config.fontSize === "lg") return "text-base sm:text-lg";
    return "text-xs sm:text-sm";
  }, [config.fontSize]);

  return (
    <>
      {/* 弹幕飞行舞台层 (绝对定位填满播放器，禁止拦截底层点击) */}
      {config.enabled && (
        <div
          className={`absolute inset-0 pointer-events-none overflow-hidden z-20 ${className}`}
          style={{ opacity: config.opacity }}
        >
          {activeDanmus.map((dm) => {
            const isSelf = dm.item.user === "我";
            const isScroll = dm.item.type === "scroll" || !dm.item.type;

            if (isScroll) {
              return (
                <div
                  key={dm.uniqueId}
                  className={`absolute whitespace-nowrap font-bold tracking-wide select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] will-change-transform ${fontSizeClass} ${
                    isSelf ? "border border-amber-400/80 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs" : ""
                  }`}
                  style={{
                    top: `${dm.trackTop}%`,
                    color: dm.item.color || "#ffffff",
                    animation: `danmuFly ${config.speed}s linear forwards`,
                    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.95), 0 0 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {isSelf && <span className="text-[10px] text-amber-300 mr-1 font-normal">[我]</span>}
                  {dm.item.text}
                </div>
              );
            }

            // 顶部固定 / 底部固定弹幕：水平居中悬停 4.5 秒淡出
            return (
              <div
                key={dm.uniqueId}
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold tracking-wide select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] will-change-transform ${fontSizeClass} ${
                  isSelf ? "border border-amber-400 px-2.5 py-0.5 rounded-full bg-black/60" : "bg-black/30 px-2 py-0.5 rounded-lg"
                }`}
                style={{
                  top: `${dm.trackTop}%`,
                  color: dm.item.color || "#ffffff",
                  animation: `danmuFade 4.5s ease-in-out forwards`,
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.95), 0 0 5px rgba(0,0,0,0.8)",
                }}
              >
                {isSelf && <span className="text-[10px] text-amber-300 mr-1 font-normal">[我]</span>}
                {dm.item.text}
              </div>
            );
          })}
        </div>
      )}

      {/* 发射成功轻量提示 */}
      {toastMsg && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 px-3 py-1 rounded-full bg-black/85 border border-amber-400 text-amber-300 text-xs shadow-2xl backdrop-blur-md flex items-center gap-1.5 animate-in fade-in zoom-in-95 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 底部交互控制条 (含设置、调色、弹幕输入与发送) */}
      <div
        ref={settingsPanelRef}
        className="absolute bottom-2.5 left-2.5 right-2.5 z-30 pointer-events-auto flex items-center justify-between gap-1.5 sm:gap-2 select-none"
      >
        {/* 输入框与调色组 */}
        <form
          onSubmit={handleSend}
          className="flex-1 max-w-sm sm:max-w-md flex items-center bg-black/75 hover:bg-black/90 backdrop-blur-md rounded-full border border-zinc-700/80 focus-within:border-amber-400 px-2 sm:px-3 py-1 transition shadow-xl"
        >
          <div className="relative flex items-center shrink-0 mr-1.5">
            {/* 调色板触发按钮 */}
            <button
              type="button"
              onClick={() => {
                setIsColorPickerOpen(!isColorPickerOpen);
                setIsSettingsOpen(false);
              }}
              className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center cursor-pointer transition hover:scale-110"
              style={{ backgroundColor: selectedColor }}
              title="切换弹幕颜色与样式"
            >
              <Palette className="w-2.5 h-2.5 text-black drop-shadow-xs" />
            </button>

            {/* 调色与模式选择气泡卡片 */}
            {isColorPickerOpen && (
              <div className="absolute bottom-full left-0 mb-3 w-56 p-3 rounded-2xl bg-zinc-950/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl flex flex-col space-y-2.5 animate-in fade-in zoom-in-95 origin-bottom-left z-50">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-xs">
                  <span className="font-bold text-white flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-[#ffcf32]" />
                    弹幕色彩与位置
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsColorPickerOpen(false)}
                    className="p-0.5 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 颜色列表 */}
                <div className="flex items-center justify-between gap-1">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedColor(c.value)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer hover:scale-110 ${
                        selectedColor === c.value ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-black" : ""
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    >
                      {selectedColor === c.value && <Check className="w-3 h-3 text-black font-black" />}
                    </button>
                  ))}
                </div>

                {/* 弹幕位置类型切换 */}
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-zinc-800/80 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSelectedType("scroll")}
                    className={`py-1 rounded-lg border text-center transition cursor-pointer ${
                      selectedType === "scroll"
                        ? "bg-[#ffcf32]/20 border-amber-400 text-[#ffcf32] font-bold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    滚动
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedType("top")}
                    className={`py-1 rounded-lg border text-center transition cursor-pointer ${
                      selectedType === "top"
                        ? "bg-[#ffcf32]/20 border-amber-400 text-[#ffcf32] font-bold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    顶端
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedType("bottom")}
                    className={`py-1 rounded-lg border text-center transition cursor-pointer ${
                      selectedType === "bottom"
                        ? "bg-[#ffcf32]/20 border-amber-400 text-[#ffcf32] font-bold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    底端
                  </button>
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="发条弹幕参与互动..."
            maxLength={60}
            className="w-full bg-transparent text-xs text-white placeholder-zinc-400 focus:outline-hidden"
            style={{ color: selectedColor !== "#ffffff" ? selectedColor : undefined }}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-1 rounded-full text-[#ffcf32] hover:text-white disabled:opacity-25 transition cursor-pointer shrink-0 ml-1"
            title="发送弹幕"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 弹幕设置与开关按钮组 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* 设置面板触发按钮 */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSettingsOpen(!isSettingsOpen);
                setIsColorPickerOpen(false);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md border text-xs flex items-center justify-center transition shadow-lg cursor-pointer ${
                isSettingsOpen
                  ? "bg-[#ffcf32] text-black border-amber-400"
                  : "bg-black/60 border-zinc-700 text-zinc-300 hover:text-white"
              }`}
              title="弹幕参数设置"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* 设置浮动面板 */}
            {isSettingsOpen && (
              <div className="absolute bottom-full right-0 mb-3 w-64 p-3.5 rounded-2xl bg-zinc-950/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl flex flex-col space-y-3 animate-in fade-in zoom-in-95 origin-bottom-right z-50 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#ffcf32]" />
                    弹幕显示设置
                  </span>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-0.5 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 不透明度调节 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>不透明度</span>
                    <span className="text-amber-300 font-bold">{Math.round(config.opacity * 100)}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[0.5, 0.75, 1.0].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateConfig({ opacity: val })}
                        className={`py-1 rounded-lg border text-center transition cursor-pointer text-[11px] ${
                          config.opacity === val
                            ? "bg-[#ffcf32]/20 border-amber-400 text-[#ffcf32] font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {Math.round(val * 100)}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* 字号大小 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>字体大小</span>
                    <span className="text-amber-300 font-bold">
                      {config.fontSize === "sm" ? "小" : config.fontSize === "md" ? "标准" : "特大"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: "sm", label: "小" },
                      { key: "md", label: "中" },
                      { key: "lg", label: "大" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => updateConfig({ fontSize: f.key as "sm" | "md" | "lg" })}
                        className={`py-1 rounded-lg border text-center transition cursor-pointer text-[11px] ${
                          config.fontSize === f.key
                            ? "bg-[#ffcf32]/20 border-amber-400 text-[#ffcf32] font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 显示区域 (防挡脸) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>显示防挡屏</span>
                    <span className="text-amber-300 font-bold">
                      {config.area === "quarter" ? "顶部1/4" : config.area === "half" ? "半屏" : "全屏"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: "quarter", label: "1/4屏" },
                      { key: "half", label: "半屏" },
                      { key: "full", label: "全屏" },
                    ].map((a) => (
                      <button
                        key={a.key}
                        onClick={() => updateConfig({ area: a.key as "quarter" | "half" | "full" })}
                        className={`py-1 rounded-lg border text-center transition cursor-pointer text-[11px] ${
                          config.area === a.key
                            ? "bg-[#ffcf32]/20 border-amber-400 text-[#ffcf32] font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 飞行速度 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>弹幕速度</span>
                    <span className="text-amber-300 font-bold">
                      {config.speed >= 15 ? "平缓" : config.speed <= 9 ? "极速" : "适中"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { key: 16, label: "平缓" },
                      { key: 12, label: "适中" },
                      { key: 8, label: "快速" },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => updateConfig({ speed: s.key })}
                        className={`py-1 rounded-lg border text-center transition cursor-pointer text-[11px] ${
                          config.speed === s.key
                            ? "bg-[#ffcf32]/20 border-amber-400 text-[#ffcf32] font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 弹幕总开关 */}
          <button
            onClick={() => updateConfig({ enabled: !config.enabled })}
            className={`p-1.5 rounded-full backdrop-blur-md border text-xs flex items-center gap-1 transition shadow-lg cursor-pointer ${
              config.enabled
                ? "bg-[#ffcf32]/20 border-amber-400/50 text-[#ffcf32]"
                : "bg-black/60 border-zinc-700 text-zinc-400 hover:text-white"
            }`}
            title={config.enabled ? "点击关闭弹幕" : "点击开启弹幕"}
          >
            {config.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden sm:inline">{config.enabled ? "弹幕开" : "弹幕关"}</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes danmuFly {
          0% {
            left: 100%;
            transform: translateX(0);
          }
          100% {
            left: 0;
            transform: translateX(-100%);
          }
        }
        @keyframes danmuFade {
          0% {
            opacity: 0;
            transform: translate(-50%, -6px) scale(0.95);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -4px) scale(0.95);
          }
        }
      `}</style>
    </>
  );
};
