"use client";

import React, { useEffect, useRef, useState } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";
import { AlertCircle, RefreshCw, MonitorPlay } from "lucide-react";
import { DanmakuOverlay } from "./DanmakuOverlay";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onOrientationDetected?: (isLandscape: boolean, width: number, height: number) => void;
  initialTime?: number;
  enableDanmaku?: boolean;
  aspectRatio?: "16/9" | "9/16" | "custom";
  className?: string;
  children?: React.ReactNode;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  title: _title,
  onTimeUpdate,
  onEnded,
  onOrientationDetected,
  initialTime = 0,
  enableDanmaku = true,
  aspectRatio = "16/9",
  className = "",
  children,
}) => {
  const artRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<Artplayer | null>(null);
  const [currentSec, setCurrentSec] = useState<number>(initialTime);

  // 1. 规范化视频流地址 (补齐如意/酷客/全网源等直链可能遗漏的 /index.m3u8，避免被误判为网页分享而走 iframe)
  const getPlayableUrl = (raw: string) => {
    let clean = (raw || "").trim();
    if (/\/play\/[a-zA-Z0-9_-]+$/.test(clean)) {
      clean = `${clean}/index.m3u8`;
    }
    return clean;
  };

  const effectiveUrl = getPlayableUrl(url);

  // 智能识别：如果是真正的网页分享链接 (/share/ 或 .html) 自动启用兼容 IFrame 播放器
  const isWebShare =
    effectiveUrl.includes("/share/") ||
    effectiveUrl.includes(".html") ||
    (!effectiveUrl.includes(".m3u8") && !effectiveUrl.includes(".mp4"));

  const [overrideIframe, setOverrideIframe] = useState<boolean | null>(null);
  const [prevUrl, setPrevUrl] = useState<string>(url);
  const [playError, setPlayError] = useState<string | null>(null);

  if (prevUrl !== url) {
    setPrevUrl(url);
    setOverrideIframe(null);
    setPlayError(null);
  }

  const useIframe = overrideIframe !== null ? overrideIframe : isWebShare;
  const setUseIframe = (val: boolean) => setOverrideIframe(val);

  useEffect(() => {
    // 拦截因浏览器切集/切源导致的 AbortError，避免 Next.js 开发弹窗或报错
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason &&
        (reason.name === "AbortError" ||
          reason.name === "NotAllowedError" ||
          (typeof reason.message === "string" &&
            (reason.message.includes("interrupted") ||
              reason.message.includes("play()"))))
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    const playUrl = getPlayableUrl(url);
    if (useIframe || !artRef.current || !playUrl) return;

    // 判断流格式
    const isMp4 = playUrl.toLowerCase().includes(".mp4");
    const streamType = isMp4 ? "mp4" : "m3u8";

    let isDestroyed = false;

    try {
      const art = new Artplayer({
        container: artRef.current,
        url: playUrl,
        poster: poster || "",
        theme: "#ffcf32", // 懂片标志黄
        volume: 0.7,
        isLive: false,
        muted: false,
        autoplay: true, // 智能起播
        pip: true,
        autoSize: false, // 禁用 autoSize，防止播放器高度被自动压缩为半截
        autoMini: false,
        screenshot: true,
        setting: true,
        loop: false,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        type: streamType,
        customType: {
          m3u8: function playM3u8(video: HTMLVideoElement, playUrl: string, artInstance: Artplayer) {
            if (Hls.isSupported()) {
              if ((artInstance as unknown as { hls?: Hls }).hls) {
                (artInstance as unknown as { hls?: Hls }).hls?.destroy();
              }
              const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                maxBufferLength: 30,
              });
              hls.loadSource(playUrl);
              hls.attachMedia(video);

              hls.on(Hls.Events.ERROR, function (_event, data) {
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      hls.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      hls.recoverMediaError();
                      break;
                    default:
                      if (!isDestroyed) {
                        setPlayError("当前流解码异常，建议切换其他可用线路");
                      }
                      hls.destroy();
                      break;
                  }
                }
              });

              (artInstance as unknown as { hls: Hls }).hls = hls;
              artInstance.on("destroy", () => {
                try {
                  hls.destroy();
                } catch {
                  // ignore
                }
              });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
              video.src = playUrl;
            } else {
              artInstance.notice.show = "当前浏览器不支持播放该格式视频";
            }
          },
        },
      });

      playerInstance.current = art;

      art.on("ready", () => {
        if (isDestroyed) return;
        setPlayError(null);
        if (initialTime > 5) {
          art.currentTime = initialTime;
          art.notice.show = `已恢复至上次进度 ${Math.floor(initialTime / 60)}分${Math.floor(initialTime % 60)}秒`;
        }

        // 尝试初次检测视频画幅
        if (art.video && art.video.videoWidth > 0 && art.video.videoHeight > 0) {
          onOrientationDetected?.(art.video.videoWidth > art.video.videoHeight, art.video.videoWidth, art.video.videoHeight);
        }
      });

      // 自动侦听视频流尺寸元数据加载，精确判断横屏或竖屏
      art.on("video:loadedmetadata", () => {
        if (!isDestroyed && art.video) {
          const w = art.video.videoWidth || 0;
          const h = art.video.videoHeight || 0;
          if (w > 0 && h > 0 && onOrientationDetected) {
            onOrientationDetected(w > h, w, h);
          }
        }
      });

      art.on("video:canplay", () => {
        if (!isDestroyed && art.video) {
          const w = art.video.videoWidth || 0;
          const h = art.video.videoHeight || 0;
          if (w > 0 && h > 0 && onOrientationDetected) {
            onOrientationDetected(w > h, w, h);
          }
        }
      });

      art.on("error", () => {
        if (!isDestroyed) {
          setPlayError("播放异常，可尝试切换线路或网页兼容模式");
        }
      });

      art.on("video:timeupdate", () => {
        if (!isDestroyed && art.video) {
          const t = art.video.currentTime || 0;
          setCurrentSec(t);
          if (onTimeUpdate) {
            onTimeUpdate(t, art.video.duration || 0);
          }
        }
      });

      art.on("video:ended", () => {
        if (!isDestroyed && onEnded) onEnded();
      });
    } catch (err) {
      console.warn("Artplayer initialization warning:", err);
    }

    return () => {
      isDestroyed = true;
      if (playerInstance.current) {
        try {
          if (playerInstance.current.video) {
            playerInstance.current.video.pause();
          }
          playerInstance.current.destroy(false);
        } catch {
          // ignore
        }
        playerInstance.current = null;
      }
    };
  }, [url, useIframe]);

  const aspectClass =
    aspectRatio === "9/16"
      ? "aspect-[9/16] w-full max-w-[420px] mx-auto min-h-[520px] max-h-[750px]"
      : aspectRatio === "custom"
      ? ""
      : "aspect-video w-full min-h-[320px] sm:min-h-[420px] md:min-h-[480px]";

  // Iframe 网页兼容播放模式 (适用如意、分享页或直链解析受限的源)
  if (useIframe) {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800 flex flex-col ${aspectClass} ${className}`}>
        <iframe
          src={effectiveUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />

        {/* 顶部悬浮扩展组件 (如右上角悬浮线路选择器) */}
        {children}

        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/70 text-zinc-400 border border-zinc-700/80 backdrop-blur">
            网页解析播放中
          </span>
          <button
            onClick={() => setUseIframe(false)}
            className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-900/90 hover:bg-black text-[#ffcf32] border border-amber-500/30 backdrop-blur cursor-pointer transition flex items-center gap-1 shadow-lg font-medium"
          >
            <MonitorPlay className="w-3 h-3" />
            切换原生播放
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800 ${aspectClass} ${className}`}>
      <div ref={artRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />

      {/* 弹幕互动发射与飞行舞台层 */}
      {enableDanmaku && (
        <DanmakuOverlay currentTime={currentSec} isPlaying={!playError} />
      )}

      {/* 顶部悬浮扩展组件 (如右上角悬浮线路选择器) */}
      {children}

      {/* 异常快速容错控制条 */}
      {playError && (
        <div className="absolute inset-x-0 bottom-14 z-30 mx-4 p-2.5 rounded-xl bg-black/85 border border-amber-500/40 backdrop-blur flex items-center justify-between text-xs text-zinc-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{playError}</span>
          </div>
          <button
            onClick={() => setUseIframe(true)}
            className="px-3 py-1 rounded-lg bg-[#ffcf32] text-black font-semibold hover:bg-amber-400 cursor-pointer transition flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            网页兼容播放
          </button>
        </div>
      )}
    </div>
  );
};
