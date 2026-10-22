import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import { isSafeInternalRedirect } from "@/lib/security";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 保护管理后台 API 接口 (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    // 排除公开的认证接口
    if (
      pathname.startsWith("/api/admin/auth/login") ||
      pathname.startsWith("/api/admin/auth/logout") ||
      pathname.startsWith("/api/admin/auth/me")
    ) {
      return NextResponse.next();
    }

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const { valid } = await verifyAdminToken(token);

    if (!valid) {
      return NextResponse.json(
        { success: false, error: "未授权：请先登录后台管理系统" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 2. 保护独立管理后台页面 (/admin/*)
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const { valid } = await verifyAdminToken(token);

    // 如果未登录且访问受保护管理后台页面，重定向至登录页
    if (!valid && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      const target = pathname + request.nextUrl.search;
      if (target !== "/admin" && target !== "/admin/resources") {
        loginUrl.searchParams.set("redirect", target);
      }
      return NextResponse.redirect(loginUrl);
    }

    // 如果已登录但访问登录页，直接跳转到后台主页
    if (valid && isLoginPage) {
      const redirectParam = request.nextUrl.searchParams.get("redirect");
      const targetUrl = isSafeInternalRedirect(redirectParam) ? redirectParam! : "/admin/resources";
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
