"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const NavigationProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // 当路径或查询参数变更完成时，进度迅速推到 100% 并淡出消失
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 250);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // 全局拦截页面内的 <a> 标签点击事件，实现原生丝滑的即时进度条
  useEffect(() => {
    let animTimer1: NodeJS.Timeout;
    let animTimer2: NodeJS.Timeout;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // 忽略外部链接、新标签页或锚点
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("#") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // 如果目标路径与当前路径完全一致（且不带参数变动），不重复触发
      const currentFull = window.location.pathname + window.location.search;
      if (href === currentFull) return;

      // 立即唤起进度条并平滑推进
      setIsVisible(true);
      setProgress(25);

      clearTimeout(animTimer1);
      clearTimeout(animTimer2);

      animTimer1 = setTimeout(() => {
        setProgress(65);
      }, 150);

      animTimer2 = setTimeout(() => {
        setProgress(88);
      }, 500);
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      clearTimeout(animTimer1);
      clearTimeout(animTimer2);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-[#ffcf32] to-yellow-200 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,207,50,0.85)]"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transition: progress === 100 ? "width 0.15s ease-out, opacity 0.25s 0.1s" : "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
};
