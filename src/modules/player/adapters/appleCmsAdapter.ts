import { PlaySource, Episode } from "@/modules/movie/types";

export interface VideoSourceAdapter {
  id: string;
  name: string;
  /**
   * 解析源地址为标准播放源结构
   */
  parse(rawSourceData: unknown): Promise<PlaySource[]>;
}

/**
 * 苹果CMS (MacCMS V10) 标准采集源适配器
 * 适配 vod_play_from / vod_play_url (如 "第01集$https://...m3u8#第02集$...")
 */
export class AppleCmsAdapter implements VideoSourceAdapter {
  id = "apple-cms-adapter";
  name = "苹果CMS标准接口适配器";

  async parse(rawSourceData: { playFrom?: string; playUrl?: string }): Promise<PlaySource[]> {
    if (!rawSourceData.playFrom || !rawSourceData.playUrl) return [];

    const fromList = rawSourceData.playFrom.split("$$$");
    const urlList = rawSourceData.playUrl.split("$$$");

    return fromList.map((fromName, idx) => {
      const episodesStr = urlList[idx] || "";
      const episodes: Episode[] = episodesStr
        .split("#")
        .filter(Boolean)
        .map((item, epIdx) => {
          const [epName, epUrl] = item.split("$");
          return {
            id: `ep-${epIdx + 1}`,
            name: epName || `第${epIdx + 1}集`,
            url: epUrl || "",
          };
        });

      return {
        id: `src-${fromName}-${idx}`,
        name: fromName || `播放线路${idx + 1}`,
        episodes,
      };
    });
  }
}
