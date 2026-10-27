import { DanmakuItem, DanmakuConfig, DEFAULT_DANMAKU_CONFIG } from "../types";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "danmaku.json");

// 优质初始种子弹幕（带视频时间戳，精准对应精彩时刻，而非死循环演示）
const INITIAL_SEED_DANMAKUS: DanmakuItem[] = [
  {
    id: "seed-1",
    movieId: "default",
    episodeId: "default",
    text: "第一集打卡！画质绝了！",
    time: 3,
    color: "#ffcf32",
    type: "scroll",
    size: "md",
    user: "追剧课代表",
    createdAt: Date.now() - 3600000 * 24,
    likes: 42,
  },
  {
    id: "seed-2",
    movieId: "default",
    episodeId: "default",
    text: "注意看！老戏骨的眼神细节拉满",
    time: 14,
    color: "#ffffff",
    type: "scroll",
    size: "md",
    user: "短剧品鉴官",
    createdAt: Date.now() - 3600000 * 18,
    likes: 19,
  },
  {
    id: "seed-3",
    movieId: "default",
    episodeId: "default",
    text: "前方高能预警！！！弹幕护体！",
    time: 32,
    color: "#f87171",
    type: "top",
    size: "lg",
    user: "熬夜冠军",
    createdAt: Date.now() - 3600000 * 12,
    likes: 88,
  },
  {
    id: "seed-4",
    movieId: "default",
    episodeId: "default",
    text: "哈哈哈哈这一巴掌扇得太解气了，爽！",
    time: 58,
    color: "#4ade80",
    type: "scroll",
    size: "md",
    user: "逆袭小能手",
    createdAt: Date.now() - 3600000 * 6,
    likes: 35,
  },
  {
    id: "seed-5",
    movieId: "default",
    episodeId: "default",
    text: "剧情节奏好快，完全停不下来",
    time: 85,
    color: "#38bdf8",
    type: "scroll",
    size: "md",
    user: "影迷阿杰",
    createdAt: Date.now() - 3600000 * 3,
    likes: 12,
  },
  {
    id: "seed-6",
    movieId: "default",
    episodeId: "default",
    text: "未完待续，求第二季！",
    time: 115,
    color: "#f472b6",
    type: "bottom",
    size: "md",
    user: "催更达人",
    createdAt: Date.now() - 3600000,
    likes: 27,
  },
];

class DanmakuService {
  private ensureDataFile(): void {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SEED_DANMAKUS, null, 2), "utf-8");
      }
    } catch (e) {
      console.warn("Failed to ensure danmaku.json:", e);
    }
  }

  // 服务端：读取全部弹幕
  public getAllServerDanmakus(): DanmakuItem[] {
    this.ensureDataFile();
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(content) || [];
      }
    } catch (e) {
      console.error("Error reading danmaku.json:", e);
    }
    return INITIAL_SEED_DANMAKUS;
  }

  // 服务端：根据 movieId 与 episodeId 获取弹幕列表
  public getByMovieAndEpisode(movieId: string, episodeId?: string): DanmakuItem[] {
    const all = this.getAllServerDanmakus();
    // 匹配特定作品或通用初始种子
    return all.filter((item) => {
      if (item.movieId === movieId) {
        if (!episodeId) return true;
        return !item.episodeId || item.episodeId === episodeId || item.episodeId === "default";
      }
      // 通用高光默认弹幕补充
      if (item.movieId === "default") {
        return true;
      }
      return false;
    });
  }

  // 服务端：添加一条新弹幕
  public addDanmaku(data: {
    movieId: string;
    episodeId: string;
    text: string;
    time: number;
    color?: string;
    type?: "scroll" | "top" | "bottom";
    size?: "sm" | "md" | "lg";
    user?: string;
  }): DanmakuItem {
    this.ensureDataFile();
    const all = this.getAllServerDanmakus();

    const newItem: DanmakuItem = {
      id: `dm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      movieId: data.movieId,
      episodeId: data.episodeId || "ep-1",
      text: data.text.trim().slice(0, 80),
      time: Math.max(0, Math.round(data.time * 10) / 10),
      color: data.color || "#ffffff",
      type: data.type || "scroll",
      size: data.size || "md",
      user: data.user || `观众_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: Date.now(),
      likes: 0,
    };

    all.push(newItem);

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write to danmaku.json:", e);
    }

    return newItem;
  }

  // 服务端：弹幕点赞
  public likeDanmaku(id: string): { success: boolean; likes: number } {
    this.ensureDataFile();
    const all = this.getAllServerDanmakus();
    const target = all.find((item) => item.id === id);
    if (!target) {
      return { success: false, likes: 0 };
    }

    target.likes = (target.likes || 0) + 1;

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write like to danmaku.json:", e);
    }

    return { success: true, likes: target.likes };
  }
}

export const danmakuService = new DanmakuService();
