"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Server,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // 获取当前登录管理员信息
  useEffect(() => {
    if (isLoginPage) return;

    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, [isLoginPage]);

  // 登出处理
  const handleLogout = async () => {
    if (!confirm("确定要退出管理后台吗？")) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  // 登录页直接渲染子内容，不显示后台框架
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      title: "资源采集站管理",
      href: "/admin/resources",
      icon: Server,
      active: pathname.startsWith("/admin/resources"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-[#ffcf32] selection:text-black">
      {/* 独立后台专属顶部导航条 */}
      <header className="sticky top-0 z-50 w-full bg-[#111218]/95 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* 左侧：品牌与独立后台标识 */}
          <div className="flex items-center gap-6">
            <Link href="/admin/resources" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#ffcf32] flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 fill-black" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    流量君<span className="text-[#ffcf32]">AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-[#ffcf32] border border-amber-500/20">
                    独立管理后台
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">线路调度与综合管理控制台</span>
              </div>
            </Link>

            {/* 后台主功能导航标签 */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-zinc-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      item.active
                        ? "bg-amber-500/15 text-[#ffcf32] border border-amber-500/30"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 右侧：状态指示、前台跳转、身份展示与登出 */}
          <div className="flex items-center gap-3">
            {/* 系统就绪指示 */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>系统运行正常</span>
            </div>

            {/* 前台主页快捷入口 */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition"
              title="新窗口打开前台网站"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">访问前台网站</span>
            </Link>

            {/* 当前登录身份与退出按钮 */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-medium text-zinc-200">
                  {currentUser?.username || "admin"}
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono">超级管理员</span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/50 hover:text-red-300 border border-red-900/40 transition cursor-pointer disabled:opacity-50"
                title="安全退出管理后台"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">退出登录</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 独立后台主内容容器 */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* 独立后台专属底部 */}
      <footer className="border-t border-zinc-800/80 bg-[#0d0e12] py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 流量君 AI · 独立管理控制台中枢</p>
          <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
            <span>权限受控环境</span>
            <span>·</span>
            <span>安全会话鉴权</span>
            <span>·</span>
            <span>全网资源调度</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
