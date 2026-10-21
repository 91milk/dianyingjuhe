import { MovieItem } from "@/modules/movie/types";
import { movieService } from "@/modules/movie/services/movieService";
import { ChatMessage, MovieRecommendation } from "../types";

export class AiMovieService {
  /**
   * 预设的热门推荐快捷提示词（参考懂片帝）
   */
  getPresetPrompts() {
    return [
      { label: "烧脑反转悬疑", prompt: "推荐几部结局超级大反转、高智商博弈的烧脑悬疑电影" },
      { label: "情绪治愈放松", prompt: "今天心情有点累，推荐温馨治愈、看完心里暖洋洋的片子" },
      { label: "硬核太空科幻", prompt: "喜欢星际穿越、探索未知宇宙和黑洞的硬科幻大片" },
      { label: "爆款爽剧短剧", prompt: "有没有节奏飞起、打脸逆袭的高能热门微短剧？" },
      { label: "王家卫光影美学", prompt: "想看有电影级调色构图和深刻时代情绪的精品剧集" },
    ];
  }

  /**
   * 核心意图解析与找片引擎
   * 支持自然语言语义理解，返回对话文本与结构化电影卡片
   */
  async generateResponse(userMessage: string, history: ChatMessage[] = []): Promise<ChatMessage> {
    const q = userMessage.trim().toLowerCase();
    const recommendations: MovieRecommendation[] = [];
    let responseText = "";

    // 1. 意图探测与召回策略
    if (q.includes("悬疑") || q.includes("烧脑") || q.includes("反转") || q.includes("梦境") || q.includes("诺兰")) {
      const inception = await movieService.getMovieById("m-102");
      const interstellar = await movieService.getMovieById("m-101");
      if (inception) {
        recommendations.push({
          movie: inception,
          recommendReason: "【终极脑洞】诺兰神作，四重潜意识梦境嵌套与开放式陀螺结局，悬疑烧脑天花板。",
        });
      }
      if (interstellar) {
        recommendations.push({
          movie: interstellar,
          recommendReason: "【五维奇观】硬核相对论物理与五维空间父女真情，后劲极大。",
        });
      }
      responseText = `为你精选了克里斯托弗·诺兰最具代表性的烧脑科幻悬疑巨作！这两部作品兼具缜密的逻辑闭环与宏大叙事，绝对让你大呼过瘾：`;
    } else if (q.includes("短剧") || q.includes("爽剧") || q.includes("逆袭") || q.includes("战神") || q.includes("闪婚")) {
      const sp1 = await movieService.getMovieById("sp-301");
      const sp2 = await movieService.getMovieById("sp-302");
      if (sp1) {
        recommendations.push({
          movie: sp1,
          recommendReason: "【战神逆袭】单集2分钟高能爽感，王者归来惩恶扬善，快节奏停不下来！",
        });
      }
      if (sp2) {
        recommendations.push({
          movie: sp2,
          recommendReason: "【甜宠喜剧】反差萌千亿总裁先婚后爱，轻松幽默高甜减压。",
        });
      }
      responseText = `为你找到了当下全网热度最高的微短剧！单集紧凑高能，随时随地开启爽快追剧体验：`;
    } else if (q.includes("科幻") || q.includes("太空") || q.includes("地球") || q.includes("未来")) {
      const wandering = await movieService.getMovieById("m-103");
      const interstellar = await movieService.getMovieById("m-101");
      if (wandering) {
        recommendations.push({
          movie: wandering,
          recommendReason: "【中国科幻里程碑】太空电梯长镜头与数字生命哲学，重工业科幻视觉震撼！",
        });
      }
      if (interstellar) {
        recommendations.push({
          movie: interstellar,
          recommendReason: "【硬核物理与爱】黑洞真实渲染与穿越时空的爱，汉斯季默配乐封神。",
        });
      }
      responseText = `浩瀚宇宙，人类命运！这两部代表了东西方科幻电影工业巅峰水准，必看之作：`;
    } else if (q.includes("繁花") || q.includes("时代") || q.includes("王家卫") || q.includes("年代")) {
      const blossoms = await movieService.getMovieById("tv-201");
      if (blossoms) {
        recommendations.push({
          movie: blossoms,
          recommendReason: "【极致视听盛宴】王家卫执导，90年代上海黄河路商海浮沉与情义交织，沪语原汁原味。",
        });
      }
      responseText = `提到时代美学与光影传奇，强烈推荐这部口碑现象级大作《繁花》：`;
    } else {
      // 模糊搜索数据库
      const searchResults = await movieService.searchMovies(q);
      if (searchResults.length > 0) {
        searchResults.slice(0, 3).forEach((item) => {
          recommendations.push({
            movie: item,
            recommendReason: item.aiHighlights?.[0] || `豆瓣 ${item.rating} 分高口碑优质佳作`,
          });
        });
        responseText = `懂片AI为你找到了与“${userMessage}”最匹配的精选片单：`;
      } else {
        const hots = await movieService.getHotMovies(2);
        hots.forEach((item) => {
          recommendations.push({
            movie: item,
            recommendReason: item.aiHighlights?.[0] || "当下最受影迷关注的热门影片",
          });
        });
        responseText = `虽然片库中暂未完全命中特定关键词，但我为你智能推荐了近期大家都在看的超高分力作：`;
      }
    }

    return {
      id: `ai-msg-${Date.now()}`,
      role: "assistant",
      content: responseText,
      recommendations,
      createdAt: Date.now(),
    };
  }
}

export const aiMovieService = new AiMovieService();
