export interface PlayerConfig {
  url: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  autoResume?: boolean; // 自动记忆续播
}

export interface PlayProgress {
  movieId: string;
  sourceId: string;
  episodeId: string;
  currentTime: number;
  duration: number;
  updatedAt: number;
}

export interface DanmakuItem {
  id: string;
  movieId: string;
  episodeId: string;
  text: string;
  time: number; // 视频对应时间点 (秒)
  color?: string; // 弹幕颜色 (如 #ffffff, #ffcf32 等)
  type?: "scroll" | "top" | "bottom"; // 滚动 / 顶部固定 / 底部固定
  size?: "sm" | "md" | "lg"; // 字号大小
  user?: string; // 用户昵称
  createdAt: number;
  likes?: number;
}

export interface DanmakuConfig {
  enabled: boolean;
  opacity: number; // 0.3 ~ 1.0 不透明度
  fontSize: "sm" | "md" | "lg"; // 弹幕字号
  area: "quarter" | "half" | "full"; // 显示区域：1/4屏(顶部防遮挡)、半屏、全屏
  speed: number; // 飞行速度时长 (秒，例如 8s / 12s / 16s)
}

export const DEFAULT_DANMAKU_CONFIG: DanmakuConfig = {
  enabled: true,
  opacity: 1,
  fontSize: "md",
  area: "half",
  speed: 12,
};
