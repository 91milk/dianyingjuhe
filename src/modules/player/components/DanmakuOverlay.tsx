"use client";

import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, Eye, EyeOff } from "lucide-react";

export interface DanmuItem {
  id: string;
  text: string;
  time: number; // 视频对应时间点 (秒)
  color?: string;
  top?: number; // 弹幕轨道百分比 (如 10%, 25%, 40% 等)
  speed?: number; // 动画时长 (秒)
}

interface DanmakuOverlayProps {
  currentTime: number;
  isPlaying?: boolean;
  onSendDanmu?: (text: string) => void;
  className?: string;
}

// 模拟真实热门弹幕库 (适用于电影、电视剧和爆爽短剧)
const PRESET_DANMUS = [
  "卧槽！这反转太绝了！",
  "战神归来，全场起立！",
  "前方高能预警！！！",
  "终于更新了，等了一星期！",
  "男主这个眼神杀我！太帅了吧！",
  "哈哈哈哈笑死我了，弹幕护体！",
  "这剧真的越看越上头，一口气刷了30集",
  "女主智商在线，爱了爱了！",
  "原著党表示还原度爆表！",
  "建议从第3集开始直接起飞！",
  "全体起立！恭迎龙王！",
  "画质好清晰啊，这源太顶了！",
  "这反派死得太解气了，爽！",
  "这才是大制作，特效拉满！",
  "二刷打卡，真的好看！",
  "背景音乐一响我就知道事情不简单",
  "别剧透啊兄弟们，专心看！",
  "太刺激了太刺激了！！！",
  "神作留名，必火！",
];

const COLORS = ["#ffffff", "#ffcf32", "#4ade80", "#60a5fa", "#f472b6", "#fbbf24"];

export const DanmakuOverlay: React.FC<DanmakuOverlayProps> = ({
  currentTime,
  isPlaying = true,
  onSendDanmu,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeDanmus, setActiveDanmus] = useState<DanmuItem[]>([]);
  const [inputText, setInputText] = useState("");
  const nextTrackRef = useRef(0);

  // 定时自动发射弹幕 (模拟真实观影互动，节奏舒适从容)
  useEffect(() => {
    if (!isPlaying || !isVisible) return;

    const interval = setInterval(() => {
      // 随机发射一条弹幕
      if (Math.random() > 0.45) {
        const text = PRESET_DANMUS[Math.floor(Math.random() * PRESET_DANMUS.length)];
        const track = (nextTrackRef.current % 5) * 15 + 8; // 分布在 8% ~ 68% 轨道
        nextTrackRef.current += 1;

        const newDanmu: DanmuItem = {
          id: `${Date.now()}-${Math.random()}`,
          text,
          time: currentTime,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          top: track,
          // 弹幕划过时长：12s ~ 16s，确保观众能够清晰舒适地阅读
          speed: 13 + Math.random() * 3,
        };

        setActiveDanmus((prev) => [...prev.slice(-20), newDanmu]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying, isVisible, currentTime]);

  // 发送自定义弹幕
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const track = (nextTrackRef.current % 5) * 15 + 8;
    nextTrackRef.current += 1;

    const userDanmu: DanmuItem = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      time: currentTime,
      color: "#ffcf32",
      top: track,
      speed: 14, // 用户自发弹幕平缓划过，便于自己和他人阅读
    };

    setActiveDanmus((prev) => [...prev.slice(-20), userDanmu]);
    if (onSendDanmu) onSendDanmu(inputText.trim());
    setInputText("");
  };

  return (
    <>
      {/* 弹幕飞行舞台层 */}
      {isVisible && (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden z-20 ${className}`}>
          {activeDanmus.map((dm) => (
            <div
              key={dm.id}
              className="absolute whitespace-nowrap text-xs sm:text-sm font-bold tracking-wide select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] will-change-transform"
              style={{
                top: `${dm.top}%`,
                color: dm.color || "#ffffff",
                animation: `danmuFly ${dm.speed || 14}s linear forwards`,
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.9), 0 0 5px rgba(0,0,0,0.6)",
              }}
            >
              {dm.text}
            </div>
          ))}
        </div>
      )}

      {/* 弹幕控制与发送条 (浮动在播放器底部) */}
      <div className="absolute bottom-2.5 left-3 right-3 z-30 pointer-events-auto flex items-center justify-between gap-2">
        <form
          onSubmit={handleSend}
          className="flex-1 max-w-sm flex items-center bg-black/75 hover:bg-black/90 backdrop-blur-md rounded-full border border-zinc-700/80 focus-within:border-amber-400 px-3 py-1 transition shadow-xl"
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-2" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="发条弹幕参与互动..."
            className="w-full bg-transparent text-xs text-white placeholder-zinc-400 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-1 rounded-full text-[#ffcf32] hover:text-white disabled:opacity-30 transition cursor-pointer"
            title="发送弹幕"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>

        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`p-1.5 rounded-full backdrop-blur-md border text-xs flex items-center gap-1 transition shadow-lg cursor-pointer ${
            isVisible
              ? "bg-[#ffcf32]/20 border-amber-400/50 text-[#ffcf32]"
              : "bg-black/60 border-zinc-700 text-zinc-400 hover:text-white"
          }`}
          title={isVisible ? "关闭弹幕" : "开启弹幕"}
        >
          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="text-[10px] hidden sm:inline">{isVisible ? "弹幕开" : "弹幕关"}</span>
        </button>
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
      `}</style>
    </>
  );
};
