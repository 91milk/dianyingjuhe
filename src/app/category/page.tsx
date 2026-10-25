import { Suspense } from "react";
import type { Metadata } from "next";
import { movieService } from "@/modules/movie/services/movieService";
import { MovieCategory } from "@/modules/movie/types";
import { CategoryClient } from "./CategoryClient";
import { CategoryPageSkeleton } from "@/components/SkeletonLoaders";
import { siteConfig } from "@/config/site";

interface PageProps {
  searchParams: Promise<{ type?: string; q?: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CATEGORY_META_MAP: Record<
  string,
  { title: string; desc: string; keywords: string[] }
> = {
  movie: {
    title: "电影片库 - 最新院线大片与经典高清电影在线播放",
    desc: "精选动作、科幻、悬疑、喜剧、爱情等热门高清电影，实时同步各大资源站高清片源，畅享影院级视听体验。",
    keywords: ["电影片库", "高清电影", "院线大片", "最新电影免费看", "经典电影"],
  },
  tv: {
    title: "热播电视剧 - 国产大剧与欧美韩日剧同步连载",
    desc: "汇聚全网热播电视剧集，支持秒级换源，同步连载更新，剧情不断档，超清画质流畅观看。",
    keywords: ["热播电视剧", "电视剧全集", "连载追剧", "国产剧", "欧美剧", "日韩剧"],
  },
  shortplay: {
    title: "爆款微短剧 - 都市逆袭战神古装爽剧大全",
    desc: "当下全网热度最高的微短剧快车道，单集高能紧凑，战神归来、先婚后爱、豪门逆袭一网打尽。",
    keywords: ["微短剧", "爽剧", "战神短剧", "都市逆袭", "全集短剧免费看"],
  },
  anime: {
    title: "动漫新番 - 顶流国漫与高燃日漫二次元专区",
    desc: "顶流国漫、玄幻修仙、高燃季番新番全收录，超清画质带你畅游二次元光影世界。",
    keywords: ["动漫新番", "国漫", "日本动漫", "热血番剧", "二次元追番"],
  },
  variety: {
    title: "热门综艺 - 爆笑真人秀与脱口秀演艺全集",
    desc: "精彩综艺娱乐盛宴，爆笑真人秀、音乐竞演、脱口秀持续更新，陪伴你的闲暇欢聚时光。",
    keywords: ["热门综艺", "真人秀", "脱口秀", "音乐综艺", "爆笑综艺"],
  },
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { type, q } = await searchParams;

  if (q && q.trim()) {
    const cleanQ = q.trim();
    return {
      title: `“${cleanQ}”相关影视搜索结果 - 全网聚合播放`,
      description: `为您呈现“${cleanQ}”的全网聚合搜索结果，多线路秒级解析，超清正片在线免费看。`,
      keywords: [cleanQ, `${cleanQ}在线播放`, `${cleanQ}免费看`, ...siteConfig.keywords],
      alternates: {
        canonical: `/category?q=${encodeURIComponent(cleanQ)}`,
      },
    };
  }

  const categoryMeta = type ? CATEGORY_META_MAP[type] : undefined;

  if (categoryMeta) {
    return {
      title: categoryMeta.title,
      description: categoryMeta.desc,
      keywords: [...categoryMeta.keywords, ...siteConfig.keywords],
      alternates: {
        canonical: `/category?type=${type}`,
      },
      openGraph: {
        title: `${categoryMeta.title} | ${siteConfig.shortName}`,
        description: categoryMeta.desc,
        url: `${siteConfig.url}/category?type=${type}`,
      },
    };
  }

  return {
    title: "影视分类检索 - 全网影视大片与剧集聚合",
    description: "多维度筛选全网电影、电视剧、热播微短剧、动漫新番与综艺，智能聚合，极速播放。",
    keywords: ["影视分类", "电影筛选", "剧集检索", ...siteConfig.keywords],
    alternates: {
      canonical: "/category",
    },
  };
}

async function CategoryContent({ searchParamsPromise }: { searchParamsPromise: Promise<{ type?: string; q?: string }> }) {
  const searchParams = await searchParamsPromise;
  const initialCategory = searchParams.type as MovieCategory | undefined;
  const initialQuery = searchParams.q;

  let initialMovies;
  if (initialQuery) {
    initialMovies = await movieService.searchMovies(initialQuery);
  } else if (initialCategory) {
    initialMovies = await movieService.getByCategory(initialCategory, 36);
  } else {
    initialMovies = await movieService.filterMovies({});
  }

  return (
    <CategoryClient
      key={`${initialCategory || "all"}-${initialQuery || ""}`}
      initialMovies={initialMovies}
      initialCategory={initialCategory}
      initialQuery={initialQuery}
    />
  );
}

export default function CategoryPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryContent searchParamsPromise={searchParams} />
    </Suspense>
  );
}
