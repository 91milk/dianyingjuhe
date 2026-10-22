import { NextRequest, NextResponse } from "next/server";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { isSafeExternalUrl } from "@/lib/security";

// GET /api/admin/resources
export async function GET() {
  const sites = resourceSiteService.getSites();
  const total = sites.length;
  const enabledCount = sites.filter((s) => s.isEnabled).length;
  const totalItemsCount = sites.reduce((sum, s) => sum + (s.totalItems || 0), 0);

  return NextResponse.json({
    success: true,
    data: {
      sites,
      stats: {
        total,
        enabledCount,
        totalItemsCount,
      },
    },
  });
}

// POST /api/admin/resources (添加新资源站)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, apiUrl, playFrom, weight } = body;

    if (!name || !apiUrl) {
      return NextResponse.json(
        { success: false, error: "名称与API接口地址为必填项" },
        { status: 400 }
      );
    }

    const check = isSafeExternalUrl(apiUrl);
    if (!check.safe) {
      return NextResponse.json(
        { success: false, error: `非法的API接口地址: ${check.reason}` },
        { status: 400 }
      );
    }

    const created = await resourceSiteService.addSite({
      name,
      apiUrl,
      playFrom,
      weight: weight ? parseInt(weight, 10) : 50,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PUT /api/admin/resources (更新状态/权重)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "缺少站点 ID" }, { status: 400 });
    }

    const updated = resourceSiteService.updateSite(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "站点不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/resources
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "缺少站点 ID" }, { status: 400 });
    }

    const ok = resourceSiteService.deleteSite(id);
    return NextResponse.json({ success: ok });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
