import { NextRequest, NextResponse } from "next/server";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { PlaySource } from "@/modules/movie/types";

// GET /api/movies/resolve?title=xxx&id=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.trim();
  const id = searchParams.get("id")?.trim();

  if (!title && !id) {
    return NextResponse.json({ success: false, error: "title or id is required" }, { status: 400 });
  }

  const resolvedSources: PlaySource[] = [];

  // 1. 如果是已知直连采集站ID格式
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

  // 2. 多源并发异步检索该片名的播放线路
  const searchKey = title || "";
  try {
    const results = await resourceSiteService.searchAcrossSites(searchKey, 10);
    // 精准或高度匹配片名
    const matched = results.find(
      (m) =>
        m.title.toLowerCase() === searchKey.toLowerCase() ||
        m.title.includes(searchKey) ||
        searchKey.includes(m.title)
    ) || results[0];

    if (matched && matched.sources.length > 0) {
      resolvedSources.push(...matched.sources);
    }
  } catch (err) {
    console.error("Resolve sources error:", err);
  }

  // 3. 如果采集站暂时未命中（例如新上映或关键词受限），提供备用极速试看测试线路确保不黑屏
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
