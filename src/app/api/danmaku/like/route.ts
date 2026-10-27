import { NextRequest, NextResponse } from "next/server";
import { danmakuService } from "@/modules/player/services/danmakuService";

// POST /api/danmaku/like
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "弹幕ID无效" },
        { status: 400 }
      );
    }

    const res = danmakuService.likeDanmaku(id);

    return NextResponse.json({
      success: res.success,
      data: { likes: res.likes },
    });
  } catch (error) {
    console.error("Danmaku like error:", error);
    return NextResponse.json(
      { success: false, error: "点赞失败" },
      { status: 500 }
    );
  }
}
