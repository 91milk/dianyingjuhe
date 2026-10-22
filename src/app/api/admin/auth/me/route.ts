import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const { valid, payload } = await verifyAdminToken(token);

  if (!valid || !payload) {
    return NextResponse.json({
      success: false,
      authenticated: false,
    });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      username: payload.username,
      role: payload.role,
    },
  });
}
