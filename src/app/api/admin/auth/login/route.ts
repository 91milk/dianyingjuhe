import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminCredentials,
  createAdminToken,
  ADMIN_COOKIE_NAME,
  getAdminConfig,
} from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "请输入管理员账号和密码" },
        { status: 400 }
      );
    }

    const isValid = checkAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "管理员账号或密码不正确" },
        { status: 401 }
      );
    }

    const token = await createAdminToken(username);
    const config = getAdminConfig();

    const response = NextResponse.json({
      success: true,
      message: "登录成功",
      user: {
        username,
        role: "superadmin",
      },
    });

    // 写入安全 HttpOnly Cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: config.sessionExpiryHours * 3600,
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
