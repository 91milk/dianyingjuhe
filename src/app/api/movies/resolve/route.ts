import { NextRequest, NextResponse } from "next/server";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { PlaySource } from "@/modules/movie/types";

// 规范化字符串用于模糊匹配（去空格、标点）
function normalizeTitle(s: string): string {
  return s.toLowerCase().replace(/[\s\-_:：·]/g, "");
}

// GET /api/movies/resolve?title=xxx&id=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim();
  const id = searchParams.get("id")?.trim();

  if (!title && !id) {
    return NextResponse.json({ success: false, error: "title or id is required" }, { status: 400 });
  }

  const resolvedSources: PlaySource[] = [];

  // 1. 如果是已知直连采集站ID格式 (cms_siteId_vodId)
  if (id && id.startsWith("cms_")) {
    const parts = id.split("_");
    if (parts.length >= 3) {
      const siteId = parts[1];
      const vodId = parts.slice(2).join("_");
      const cmsDetail = await resourceSiteService.getDetailFromSite(siteId, vodId);
      if (cmsDetail && cmsDetail.sources.length > 0) {
        return NextResponse.json({
          success: true,
          sources: cmsDetail.sources,
          fromCache: false,
          matchedTitle: cmsDetail.title,
        });
      }
    }
  }

  // 2. 跨全网已启用资源站发起并发检索
  const searchKey = title || "";
  try {
    const results = await resourceSiteService.searchAcrossSites(searchKey, 15);
    const normKey = normalizeTitle(searchKey);

    // 筛选出所有匹配该片名的结果，并合并其播放线路
    for (const item of results) {
      const normItem = normalizeTitle(item.title);
      const isMatch =
        normItem === normKey ||
        normItem.includes(normKey) ||
        normKey.includes(normItem);

      if (isMatch && item.sources.length > 0) {
        resolvedSources.push(...item.sources);
      }
    }

    // 如果归一化没有完全命中，尝试采用最相关的第一条搜索结果
    if (resolvedSources.length === 0 && results.length > 0 && results[0].sources.length > 0) {
      resolvedSources.push(...results[0].sources);
    }
  } catch (err) {
    console.error("Resolve sources error:", err);
  }

  // 3. 只有当全网完全搜不到时才注入兜底备用线，避免正常影视被兜底覆盖
  if (resolvedSources.length === 0) {
    resolvedSources.push({
      id: "src-fallback",
      name: "全网云播预检线 (演示)",
      episodes: [
        {
          id: "ep-1",
          name: "高清预检正片",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        },
      ],
    });
  }

  return NextResponse.json({
    success: true,
    sources: resolvedSources,
    count: resolvedSources.length,
  });
}
