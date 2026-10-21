import { MovieItem, FilterOptions, MovieCategory } from "../types";
import { mockMovies } from "./mockData";

export class MovieService {
  private movies: MovieItem[] = mockMovies;

  /**
   * 获取精选轮播/焦点影片
   */
  async getFeaturedMovies(): Promise<MovieItem[]> {
    return this.movies.filter((m) => m.isFeatured);
  }

  /**
   * 获取热门爆款推荐
   */
  async getHotMovies(limit = 8): Promise<MovieItem[]> {
    return this.movies.filter((m) => m.isHot).slice(0, limit);
  }

  /**
   * 按分类获取影片列表
   */
  async getByCategory(category: MovieCategory, limit = 12): Promise<MovieItem[]> {
    return this.movies.filter((m) => m.category === category).slice(0, limit);
  }

  /**
   * 根据 ID 查询影片详情
   */
  async getMovieById(id: string): Promise<MovieItem | null> {
    const movie = this.movies.find((m) => m.id === id);
    return movie || null;
  }

  /**
   * 综合多条件筛选
   */
  async filterMovies(options: FilterOptions): Promise<MovieItem[]> {
    return this.movies.filter((item) => {
      if (options.category && item.category !== options.category) {
        return false;
      }
      if (options.genre && options.genre !== "全部" && !item.genres.includes(options.genre)) {
        return false;
      }
      if (options.region && options.region !== "全部" && item.region !== options.region) {
        return false;
      }
      if (options.year && options.year !== "全部" && item.year.toString() !== options.year) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (options.sort === "rating") return b.rating - a.rating;
      if (options.sort === "latest") return b.year - a.year;
      return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0);
    });
  }

  /**
   * 关键字模糊搜索
   */
  async searchMovies(query: string): Promise<MovieItem[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return this.movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        (m.actors && m.actors.some((a) => a.toLowerCase().includes(q))) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.summary.toLowerCase().includes(q)
    );
  }

  /**
   * 获取相似电影推荐
   */
  async getSimilarMovies(id: string, limit = 4): Promise<MovieItem[]> {
    const target = await this.getMovieById(id);
    if (!target) return [];
    return this.movies
      .filter((m) => m.id !== id && (m.category === target.category || m.genres.some((g) => target.genres.includes(g))))
      .slice(0, limit);
  }
}

export const movieService = new MovieService();
