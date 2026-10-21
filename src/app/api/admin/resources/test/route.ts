import { NextRequest, NextResponse } from "next/server";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { ResourceSite } from "@/modules/collector/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, apiUrl } = body;

    let targetSite: ResourceSite | undefined;
    if (id) {
      targetSite = resourceSiteService.getSites().find((s) => s.id === id);
    } else if (apiUrl) {
      targetSite = {
        id: "temp",
        name: "临时测试",
        apiUrl,
        type: "maccms_v10",
        isEnabled: true,
        weight: 10,
        status: "untested",
        createdAt: Date.now(),
      };
    }

    if (!targetSite) {
      return NextResponse.json({ success: false, error: "未提供有效的资源站信息" }, { status: 400 });
    }

    const result = await resourceSiteService.testSite(targetSite);

    // 如果是现有站点，更新测试结果
    if (id) {
      resourceSiteService.updateSite(id, {
        status: result.status,
        responseTime: result.responseTime,
        totalItems: result.totalItems,
        lastCheckedAt: Date.now(),
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
