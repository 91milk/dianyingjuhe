import { MovieItem } from "@/modules/movie/types";

export interface ResourceSite {
  id: string;
  name: string;           // 资源站名称，如 "茅台资源", "量子资源", "红牛资源"
  apiUrl: string;         // 接口URL，如 "https://caiji.maotai999.vip/api.php/provide/vod/from/mtm3u8/at/josn/"
  type: "maccms_v10" | "maccms_v8" | "custom_json";
  playFrom?: string;      // 播放前缀代码，如 "mtm3u8"
  isEnabled: boolean;     // 是否启用
  weight: number;         // 排序权重 (越大越优先)
  status: "online" | "offline" | "untested";
  responseTime?: number;  // 延迟 (ms)
  totalItems?: number;    // 片源总数
  lastCheckedAt?: number; // 上次检测时间戳
  createdAt: number;
}

export interface MacCmsItem {
  vod_id: number | string;
  vod_name: string;
  type_id?: number | string;
  type_id_1?: number | string;
  type_name?: string;
  vod_en?: string;
  vod_time?: string;
  vod_remarks?: string;
  vod_play_from?: string;
  vod_play_server?: string;
  vod_play_note?: string;
  vod_play_url?: string;
  vod_pic?: string;
  vod_actor?: string;
  vod_director?: string;
  vod_blurb?: string;
  vod_content?: string;
  vod_year?: string;
  vod_area?: string;
  vod_score?: string;
  vod_class?: string;
}

export interface MacCmsResponse {
  code: number;
  msg?: string;
  page: number | string;
  pagecount: number | string;
  limit: string;
  total: number | string;
  list: MacCmsItem[];
}
