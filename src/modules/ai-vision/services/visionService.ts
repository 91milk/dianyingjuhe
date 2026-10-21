import { movieService } from "@/modules/movie/services/movieService";
import { VisionSearchResult } from "../types";

export class VisionService {
  /**
   * 识图搜片（截图/名场面/海报识别）
   * 预留多模态大模型（Vision LLM）接口，支持本地与云端扩展
   */
  async searchByImage(file: File | string): Promise<VisionSearchResult[]> {
    // 模拟视觉模型识别特征（在实际生产中可调用云端 Vision API 或本地 CLIP 模型）
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 默认高拟真召回示例影片
    const movie = await movieService.getMovieById("m-101");
    if (!movie) return [];

    return [
      {
        movie,
        similarity: 96,
        matchedSceneDescription: "检测到特征名场面：库珀穿越虫洞与米勒星球巨大海啸巨浪场景。",
      },
      {
        movie: (await movieService.getMovieById("m-102")) || movie,
        similarity: 82,
        matchedSceneDescription: "次要匹配项：相似科幻与现实交织视觉风格。",
      },
    ];
  }
}

export const visionService = new VisionService();
