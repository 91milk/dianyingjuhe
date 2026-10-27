import { NextRequest, NextResponse } from "next/server";
import { danmakuService } from "@/modules/player/services/danmakuService";

// GET /api/danmaku?movieId=...&episodeId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId") || "default";
    const episodeId = searchParams.get("episodeId") || undefined;

    const list = danmakuService.getByMovieAndEpisode(movieId, episodeId);

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("Danmaku GET error:", error);
    return NextResponse.json(
      { success: false, error: "获取弹幕列表失败" },
      { status: 500 }
    );
  }
}

// POST /api/danmaku
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { movieId, episodeId, text, time, color, type, size, user } = body;

    if (!movieId || !text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, error: "作品ID及弹幕文本不能为空" },
        { status: 400 }
      );
    }

    if (text.trim().length > 80) {
      return NextResponse.json(
        { success: false, error: "弹幕字数不能超过 80 个字符" },
        { status: 400 }
      );
    }

    const created = danmakuService.addDanmaku({
      movieId,
      episodeId: episodeId || "ep-1",
      text: text.trim(),
      time: typeof time === "number" ? time : 0,
      color,
      type,
      size,
      user,
    });

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error) {
    console.error("Danmaku POST error:", error);
    return NextResponse.json(
      { success: false, error: "发射弹幕失败，请重试" },
      { status: 500 }
    );
  }
}
