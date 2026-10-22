import { NextRequest, NextResponse } from "next/server";
import { resourceSiteService } from "@/modules/collector/services/resourceSiteService";
import { PlaySource, MovieItem } from "@/modules/movie/types";
import { siteConfig } from "@/config/site";
import { sanitizeInput } from "@/lib/security";
import { deduplicateSources } from "@/modules/movie/utils/sourceDeduplicator";

// 规范化字符串用于模糊匹配（去空格、标点）
function normalizeTitle(s: string): string {
  return s.toLowerCase().replace(/[\s\-_:：·]/g, "");
}

// GET /api/movies/resolve?title=xxx&id=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = sanitizeInput(searchParams.get("title"), 100);
  const id = sanitizeInput(searchParams.get("id"), 100);

  if (!title && !id) {
    return NextResponse.json({ success: false, error: "title or id is required" }, { status: 400 });
  }

  let resolvedSources: PlaySource[] = [];
  let targetTitle = title || "";

  // 1. 如果是已知直连采集站ID格式 (cms_siteId_vodId)，先提取该站点的一手直出线路
  if (id && id.startsWith("cms_")) {
    const parts = id.split("_");
    if (parts.length >= 3) {
      const siteId = parts[1];
      const vodId = parts.slice(2).join("_");
      const cmsDetail = await resourceSiteService.getDetailFromSite(siteId, vodId);
      if (cmsDetail && cmsDetail.sources && cmsDetail.sources.length > 0) {
        resolvedSources.push(...cmsDetail.sources);
        if (!targetTitle && cmsDetail.title) {
          targetTitle = cmsDetail.title;
        }
      }
    }
  }

  // 2. 跨全网所有已启用资源站发起并发全量检索 (全网、茅台、如意、暴风、非凡、魔都、红牛等全部聚合)
  const searchKey = targetTitle || title || "";
  if (searchKey) {
    try {
      const results = await resourceSiteService.searchAcrossSites(searchKey, siteConfig.collector.searchLimit);
      const normKey = normalizeTitle(searchKey);

      const exactMatches: MovieItem[] = [];
      const partialMatches: MovieItem[] = [];

      // 分流精确匹配与模糊包含匹配
      for (const item of results) {
        const normItem = normalizeTitle(item.title);
        if (normItem === normKey) {
          exactMatches.push(item);
        } else if (normItem.includes(normKey) || normKey.includes(normItem)) {
          partialMatches.push(item);
        }
      }

      // 精确匹配片名的资源站排在绝对优先位
      const sortedItems = [...exactMatches, ...partialMatches];
      if (sortedItems.length === 0 && results.length > 0) {
        sortedItems.push(...results);
      }

      for (const item of sortedItems) {
        if (item.sources && item.sources.length > 0) {
          resolvedSources.push(...item.sources);
        }
      }

      // 执行专业级智能去重：按站点择优剔除残缺源/预告片/镜像流，彻底解决多条重复显示问题
      resolvedSources = deduplicateSources(resolvedSources);

      // 优先展示原生直接支持播放的 m3u8/mp4 极速直链，保障立即起播
      resolvedSources.sort((a, b) => {
        const aUrl = a.episodes[0]?.url || "";
        const bUrl = b.episodes[0]?.url || "";
        const aIsDirect = aUrl.includes(".m3u8") || aUrl.includes(".mp4");
        const bIsDirect = bUrl.includes(".m3u8") || bUrl.includes(".mp4");
        if (aIsDirect && !bIsDirect) return -1;
        if (!aIsDirect && bIsDirect) return 1;
        return 0;
      });
    } catch (err) {
      console.error("Resolve sources error:", err);
    }
  }

  // 3. 只有当全网完全搜不到任何线路时才注入兜底备用线
  if (resolvedSources.length === 0) {
    resolvedSources.push({
      id: "src-fallback",
      name: "全网云播预检线 (演示)",
      episodes: [
        {
          id: "ep-1",
          name: "高清预检正片",
          url: siteConfig.fallbackPlayUrl,
        },
      ],
    });
  }

  return NextResponse.json({
    success: true,
    sources: resolvedSources,
    data: {
      sources: resolvedSources,
    },
    count: resolvedSources.length,
    matchedTitle: targetTitle,
  });
}
