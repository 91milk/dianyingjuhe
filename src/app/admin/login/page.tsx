"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { isSafeInternalRedirect } from "@/lib/security";

function LoginForm() {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectUrl = isSafeInternalRedirect(rawRedirect) ? rawRedirect! : "/admin/resources";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("请输入完整的管理员账号与密码");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // 使用 window.location.href 确保完整刷新并触发最新 Cookie 会话生效
        window.location.href = isSafeInternalRedirect(redirectUrl) ? redirectUrl : "/admin/resources";
      } else {
        setError(data.error || "登录凭据校验失败，请检查账号密码");
      }
    } catch {
      setError("网络请求异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setUsername("admin");
    setPassword("admin888888");
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#07080b]">
      {/* 背景动态流光与网格装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,207,50,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 登录卡片 */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#121319]/90 backdrop-blur-xl border border-zinc-800/90 rounded-2xl shadow-2xl shadow-black/80 p-8">
          {/* 品牌标识 */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#ffcf32] flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-400/25 mb-4 group hover:scale-105 transition-transform">
              <ShieldCheck className="w-8 h-8 fill-black" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              流量君<span className="text-[#ffcf32]">AI</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-normal">
                独立后台
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              系统受权限保护，请通过管理员身份认证后进行管理
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 flex items-start gap-3 text-red-200 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                管理员账号
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号 (如: admin)"
                  autoComplete="username"
                  required
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-[#ffcf32] focus:ring-1 focus:ring-[#ffcf32] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden transition"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                管理安全密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  required
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-[#ffcf32] focus:ring-1 focus:ring-[#ffcf32] rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden transition"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#ffcf32] hover:bg-[#ffe066] text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>安全鉴权验证中...</span>
                </>
              ) : (
                <>
                  <span>安全登录管理后台</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 快捷默认凭证填充提示 */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>系统出厂默认凭据：</span>
              <button
                type="button"
                onClick={fillDefaultCredentials}
                className="text-[#ffcf32] hover:underline font-medium cursor-pointer"
              >
                点此一键填入
              </button>
            </div>
            <div className="bg-zinc-900/80 rounded-lg p-2.5 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>账号: <strong className="text-zinc-200">admin</strong></span>
              <span>密码: <strong className="text-zinc-200">admin888888</strong></span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              * 正式部署环境可通过系统环境变量 <code className="text-zinc-400">ADMIN_USERNAME</code> 与 <code className="text-zinc-400">ADMIN_PASSWORD</code> 自定义管理口令。
            </p>
          </div>
        </div>

        {/* 底部返回首页导航 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回流量君 AI 前台主页</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080b] flex items-center justify-center text-zinc-400 text-sm">
          加载登录模块中...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
