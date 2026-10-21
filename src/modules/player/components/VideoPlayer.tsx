"use client";

import React, { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  initialTime?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  title,
  onTimeUpdate,
  onEnded,
  initialTime = 0,
}) => {
  const artRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!artRef.current || !url) return;

    // 判断流格式，保证 type 永远是合格的 string 类型
    const isMp4 = url.toLowerCase().includes(".mp4");
    const streamType = isMp4 ? "mp4" : "m3u8";

    let art: Artplayer;

    try {
      art = new Artplayer({
        container: artRef.current,
        url: url,
        poster: poster || "",
        theme: "#ffcf32", // 懂片黄
        volume: 0.7,
        isLive: false,
        muted: false,
        autoplay: false,
        pip: true,
        autoSize: true,
        autoMini: true,
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
              });
              hls.loadSource(playUrl);
              hls.attachMedia(video);
              (artInstance as unknown as { hls: Hls }).hls = hls;
              artInstance.on("destroy", () => {
                hls.destroy();
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
        if (initialTime > 5) {
          art.currentTime = initialTime;
          art.notice.show = `已自动恢复至上次进度 ${Math.floor(initialTime / 60)}分${Math.floor(initialTime % 60)}秒`;
        }
      });

      art.on("video:timeupdate", () => {
        if (onTimeUpdate && art.video) {
          onTimeUpdate(art.video.currentTime, art.video.duration || 0);
        }
      });

      art.on("video:ended", () => {
        if (onEnded) onEnded();
      });
    } catch (err) {
      console.error("Artplayer initialization error:", err);
    }

    return () => {
      if (playerInstance.current && playerInstance.current.destroy) {
        playerInstance.current.destroy(false);
        playerInstance.current = null;
      }
    };
  }, [url]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
      <div ref={artRef} className="w-full h-full" />
    </div>
  );
};
