import { NextRequest, NextResponse } from "next/server";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id = "maotai", hours = 24 } = body;

    const result = await resourceSiteService.syncRecentFromSite(id, hours);

    return NextResponse.json({
      success: true,
      message: `成功同步【${id}】近 ${hours} 小时内 ${result.count} 部最新资源，本地片库索引达到 ${result.total} 部`,
      data: result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
