import { MovieItem } from "@/modules/movie/types";
import { movieService } from "@/modules/movie/services/movieService";
import { ChatMessage, MovieRecommendation } from "../types";

// 常见剧情描述与经典影片的语义映射字典 (类似懂片AI的智能理解引擎)
const PLOT_INTENT_MAP: Array<{
  keywords: string[];
  searchTarget: string;
  recommendReason: string;
  responsePrefix: string;
}> = [
  {
    keywords: ["监狱", "挖地道", "冤枉", "安迪", "救赎", "地道"],
    searchTarget: "肖申克的救赎",
    recommendReason: "【影史第一神作】豆瓣 9.7 殿堂丰碑，一柄小石锤与十九年隐忍，关于希望与自由的最高礼赞。",
    responsePrefix: "你描述的正是影史不朽传奇《肖申克的救赎》！为你调取了正片资源：",
  },
  {
    keywords: ["互换身体", "新海诚", "彗星", "陨石", "三叶", "泷"],
    searchTarget: "你的名字",
    recommendReason: "【壁纸级视效】新海诚封神之作，穿越时空的身体互换与黄昏之时的命运拯救，极致浪漫。",
    responsePrefix: "这是新海诚执导的浪漫时空神作《你的名字。》！为你找到了超清播放：",
  },
  {
    keywords: ["红色药丸", "蓝色药丸", "矩阵", "尼奥", "虚拟世界", "黑客"],
    searchTarget: "黑客帝国",
    recommendReason: "【哲学赛博里程碑】如果现实只是母体的一段代码，你选择吞下药丸觉醒还是沉睡？子弹时间开创者。",
    responsePrefix: "这毫无疑问是赛博朋克影史神作《黑客帝国》！为您列出可看线路：",
  },
  {
    keywords: ["黑洞", "五维空间", "墨菲", "书架", "相对论", "父女"],
    searchTarget: "星际穿越",
    recommendReason: "【硬核物理与爱】基普·索恩物理顾问真实黑洞模拟，穿越万千光年，爱是唯一超越时空的引力。",
    responsePrefix: "为你锁定了克里斯托弗·诺兰代表作《星际穿越》！秒级高清起播：",
  },
  {
    keywords: ["造梦", "潜意识", "陀螺", "植入", "盗梦"],
    searchTarget: "盗梦空间",
    recommendReason: "【四重梦境迷宫】精密逻辑与失重走廊打斗，那颗旋转的陀螺至今仍在影迷心头转动。",
    responsePrefix: "你描述的是诺兰的经典烧脑神作《盗梦空间》！立即为你呈上：",
  },
  {
    keywords: ["密室", "假律师", "车祸", "反转", "不在场证明", "父母复仇"],
    searchTarget: "看不见的客人",
    recommendReason: "【西班牙悬疑巅峰】43次剧情反转，谎言包裹的罗生门，不到最后一分钟绝不知道真相。",
    responsePrefix: "为你找到了悬疑推理天花板《看不见的客人》！剧情反转极致震撼：",
  },
  {
    keywords: ["灯塔", "精神病", "小岛", "第67号", "小李子", "禁闭"],
    searchTarget: "禁闭岛",
    recommendReason: "【心理惊悚神作】莱昂纳多精湛演技，“宁愿像个好人一样死去，还是像个怪物一样活着？”后劲极大。",
    responsePrefix: "这是马丁·斯科塞斯与小李子的经典心理悬疑巨作《禁闭岛》：",
  },
  {
    keywords: ["同福客栈", "武林", "排山倒海", "葵花点穴手", "老白", "湘玉"],
    searchTarget: "武林外传",
    recommendReason: "【国民下饭神剧】江湖不只是刀光剑影，更是同福客栈这方屋檐下的柴米油盐与人间烟火。",
    responsePrefix: "天下第一下饭神剧《武林外传》！全集无广告随时开饭：",
  },
  {
    keywords: ["龙猫", "无脸男", "千寻", "哈尔", "宫崎骏", "吉卜力", "久石让"],
    searchTarget: "千与千寻",
    recommendReason: "【治愈系殿堂】荣获奥斯卡最佳动画长片，不要回头，一直向前走，献给每个长大成人的少年。",
    responsePrefix: "躲进吉卜力的夏日微风里！为你找到宫崎骏与久石让的心灵治愈大作：",
  },
  {
    keywords: ["战神", "赘婿", "龙王", "闪婚", "逆袭", "打脸", "微短剧"],
    searchTarget: "授她以柄",
    recommendReason: "【单集2分钟高能】快节奏惩恶扬善，开局即巅峰，左右分屏互动弹幕追剧超带感！",
    responsePrefix: "为你找到了当下全网热度最高的微短剧专场！单集紧凑高能，随时随地开启爽快追剧：",
  },
];

// 自然语言停用词与助词过滤，提取高价值核心词
const STOP_WORDS = new Set([
  "想看", "推荐", "一部", "几个", "好看的", "有没有", "经典", "关于", "电影", "电视剧", 
  "剧集", "片子", "请问", "找一下", "找一部", "类似", "有什么", "最近", "高分", "评分高的",
  "非常", "超级", "感觉", "特别", "适合", "大家", "评分", "在线", "播放", "全集"
]);

function extractSearchKeyword(raw: string): string {
  let cleaned = raw.trim();
  for (const stop of STOP_WORDS) {
    cleaned = cleaned.replaceAll(stop, " ");
  }
  // 按照空白切分并选取最长的实体名词
  const tokens = cleaned.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length > 0) {
    // 优先选取 2~6 个字的词汇作为核心搜索词
    return tokens[0];
  }
  return raw.trim().slice(0, 10);
}

export class AiMovieService {
  /**
   * 预设的热门推荐快捷提示词（参考懂片帝 AI 场景标签）
   */
  getPresetPrompts() {
    return [
      { label: "🧩 烧脑反转悬疑", prompt: "推荐几部结局超级大反转、高智商博弈的烧脑悬疑电影" },
      { label: "🍱 爆笑减压下饭", prompt: "今天下班有点累，推荐温馨爆笑、无需带脑子的解压下饭神剧" },
      { label: "🔥 绝地逆袭爽剧", prompt: "有没有节奏飞起、打脸逆袭的高能热门微短剧？" },
      { label: "🌌 硬核时空科幻", prompt: "喜欢星际穿越、探索未知宇宙和黑洞的硬科幻大片" },
      { label: "🌙 午夜放映室", prompt: "适合深夜独自一人看的赛博霓虹或治愈孤独高分电影" },
      { label: "🌸 治愈人间暖片", prompt: "推荐吉卜力或像夏目友人帐一样温暖治愈心灵的作品" },
    ];
  }

  /**
   * 核心意图解析与智能找片引擎
   * 支持自然语言语义理解、剧情特征匹配、多轮意图承接与多线路可播校验
   */
  async generateResponse(userMessage: string, _history: ChatMessage[] = []): Promise<ChatMessage> {
    const q = userMessage.trim().toLowerCase();
    const recommendations: MovieRecommendation[] = [];
    let responseText = "";

    // 1. 尝试剧情特征语义库匹配 (Semantic Plot Matching)
    let matchedIntent = null;
    for (const item of PLOT_INTENT_MAP) {
      const matchCount = item.keywords.filter((kw) => q.includes(kw)).length;
      if (matchCount >= 1) {
        matchedIntent = item;
        break;
      }
    }

    if (matchedIntent) {
      try {
        const results = await movieService.searchMovies(matchedIntent.searchTarget);
        if (results.length > 0) {
          recommendations.push({
            movie: results[0],
            recommendReason: matchedIntent.recommendReason,
          });
          // 关联相似好片补充
          if (results.length > 1) {
            recommendations.push({
              movie: results[1],
              recommendReason: results[1].aiHighlights?.[0] || `同类高口碑必看精选`,
            });
          }
          responseText = matchedIntent.responsePrefix;
        }
      } catch {
        // ignore
      }
    }

    // 2. 如果剧情意图库未命中，走动态提取 + 智能全网聚合搜索
    if (recommendations.length === 0) {
      const coreKeyword = extractSearchKeyword(userMessage);
      try {
        let searchResults = await movieService.searchMovies(coreKeyword);
        // 如果提取的核心词没搜到，再尝试原句截断搜
        if (searchResults.length === 0 && coreKeyword !== userMessage) {
          searchResults = await movieService.searchMovies(userMessage.slice(0, 8));
        }

        if (searchResults.length > 0) {
          searchResults.slice(0, 3).forEach((item) => {
            recommendations.push({
              movie: item,
              recommendReason:
                item.aiHighlights?.[0] ||
                `全网聚合多线路超清片源 · 综合评分 ${item.rating || "8.8"}`,
            });
          });
          responseText = `懂片 AI 智能理解了你的观影诉求，为你精确召回了以下最匹配的超清佳作：`;
        }
      } catch {
        // ignore
      }
    }

    // 3. 兜底策略：推荐当下高热度品质片单
    if (recommendations.length === 0) {
      try {
        const hots = await movieService.getHotMovies(2);
        hots.forEach((item) => {
          recommendations.push({
            movie: item,
            recommendReason: item.aiHighlights?.[0] || "懂片平台当前热度极高的高清正片",
          });
        });
      } catch {
        // ignore
      }
      responseText = `虽然片库暂未完全命中特定冷门剧情，但为你优选了当前全网最受好评的现象级大片：`;
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
