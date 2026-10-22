import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { movieService } from "@/modules/movie/services/movieService";
import { encodePlayId } from "@/lib/playCipher";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.startsWith("http")
    ? siteConfig.url
    : `https://${siteConfig.url}`;

  const now = new Date();

  // 1. 静态主路由
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category?type=movie`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category?type=tv`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category?type=shortplay`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category?type=anime`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category?type=variety`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // 2. 动态聚合高热度影片详情与播放落地页
  try {
    const [featured, topDouban, hotTvs, shortPlays, liveUpdates] = await Promise.all([
      movieService.getFeaturedMovies(),
      movieService.getDoubanTopMovies(20),
      movieService.getByCategory("tv", 20),
      movieService.getByCategory("shortplay", 20),
      movieService.getLiveLatestMovies(30),
    ]);

    const allMovies = [
      ...featured,
      ...topDouban,
      ...hotTvs,
      ...shortPlays,
      ...liveUpdates,
    ];

    // 排重
    const movieMap = new Map<string, (typeof allMovies)[0]>();
    allMovies.forEach((m) => {
      if (m && m.id && !movieMap.has(m.id)) {
        movieMap.set(m.id, m);
      }
    });

    const movieRoutes: MetadataRoute.Sitemap = Array.from(movieMap.values()).map(
      (movie) => {
        const encodedId = encodePlayId(movie.id);
        return {
          url: `${baseUrl}/play/${encodedId}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        };
      }
    );

    return [...staticRoutes, ...movieRoutes];
  } catch {
    return staticRoutes;
  }
}
