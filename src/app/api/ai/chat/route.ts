import { NextRequest, NextResponse } from "next/server";
import { aiMovieService } from "@/modules/ai-chat/services/aiService";
import { sanitizeInput } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "message is required" },
        { status: 400 }
      );
    }

    const cleanMessage = sanitizeInput(message, 500);
    if (!cleanMessage) {
      return NextResponse.json(
        { success: false, error: "message cannot be empty" },
        { status: 400 }
      );
    }

    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];
    const response = await aiMovieService.generateResponse(cleanMessage, safeHistory);
    return NextResponse.json({ success: true, data: response });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
