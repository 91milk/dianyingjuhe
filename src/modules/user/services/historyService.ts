import { HistoryRecord } from "../types";

const STORAGE_KEY = "dongpian_watch_history_v1";

export class HistoryService {
  /**
   * 保存或更新观看历史进度
   */
  saveProgress(record: HistoryRecord) {
    if (typeof window === "undefined") return;
    try {
      const list = this.getHistory();
      const filtered = list.filter((item) => item.movieId !== record.movieId);
      const updated = [record, ...filtered].slice(0, 30); // 保留最近30条
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  /**
   * 获取所有观看历史
   */
  getHistory(): HistoryRecord[] {
    if (typeof window === "undefined") return [];
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * 获取单部影片的历史进度
   */
  getMovieProgress(movieId: string): HistoryRecord | null {
    const list = this.getHistory();
    return list.find((item) => item.movieId === movieId) || null;
  }

  /**
   * 删除单条
   */
  removeHistory(movieId: string) {
    if (typeof window === "undefined") return;
    const list = this.getHistory().filter((i) => i.movieId !== movieId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /**
   * 清空所有
   */
  clearAll() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const historyService = new HistoryService();
