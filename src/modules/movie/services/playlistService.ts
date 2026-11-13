import { ThematicPlaylist } from "../types/playlist";
import { MovieItem } from "../types";
import { movieService } from "./movieService";

export const PRESET_PLAYLISTS: ThematicPlaylist[] = [
  {
    id: "pl-midnight-theater",
    slug: "midnight-theater",
    title: "午夜放映室 · 霓虹与心事",
    titleEn: "Midnight Cinema · Neon & Solitude",
    titleJa: "ミッドナイト・シアター · ネオンと孤独",
    subtitle: "赛博霓虹、隐秘犯罪与治愈孤独的深夜声色",
    subtitleEn: "Cyberpunk neon, hidden crimes and soulful late-night cinematic gems",
    subtitleJa: "サイバーパンクのネオンと孤独を癒やす珠玉の深夜シネマ",
    description: "专为凌晨时分打造的沉浸片单。剥离喧嚣与焦虑，在雨夜低保真配乐、冷峻赛博光影与深刻心理对决中，找回属于夜晚的纯粹浪漫。",
    descriptionEn: "Curated for nocturnal souls. Escape everyday noise with lo-fi rain beats, neon reflections, and deep psychological narratives.",
    descriptionJa: "夜更けのひとときに寄り添う特別セレクション。雨音とネオン、そして深淵なる物語に浸る。",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    badge: "午夜专线",
    badgeEn: "Midnight Cut",
    badgeJa: "深夜特選",
    themeColor: "from-indigo-950/80 via-purple-950/40 to-black",
    accentColor: "#a855f7",
    tags: ["赛博朋克", "冷峻悬疑", "深夜独处", "高分佳作", "新黑色电影"],
    itemCount: 8,
    movieKeywords: ["银翼杀手", "爱死机", "攻壳机动队", "黑客帝国", "禁闭岛", "穆赫兰道", "出租车司机", "搏击俱乐部"],
    views: 18420,
    likes: 2360,
  },
  {
    id: "pl-nolan-universe",
    slug: "nolan-universe",
    title: "诺兰时空迷宫 · 烧脑编年史",
    titleEn: "Christopher Nolan · Chrono-Labyrinth",
    titleJa: "クリストファー・ノーラン · 時空の迷宮",
    subtitle: "非线性叙事、多重梦境与物理法则的狂欢",
    subtitleEn: "Non-linear epics, nested dreamscapes, and gravitational marvels",
    subtitleJa: "非線形な叙事詩と重層構造の夢、究極の思考パズル",
    description: "从黑洞边际的五维超立方体，到陀螺未倒的多重潜意识梦境。克里斯托弗·诺兰用近乎严苛的实拍与精密剧本，重新定义现代科幻与悬疑的工业顶峰。",
    descriptionEn: "From the five-dimensional tesseract past Gargantua to the spinning totem of Inception. The definitive Nolan retrospective.",
    descriptionJa: "『インターステラー』から『インセプション』まで、世界最高峰の知性が織りなす極限のシネマ体験。",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    badge: "硬核烧脑",
    badgeEn: "Brain Melt",
    badgeJa: "超難解",
    themeColor: "from-blue-950/80 via-zinc-900 to-black",
    accentColor: "#38bdf8",
    tags: ["硬核科幻", "反转烧脑", "诺兰", "奥斯卡金奖", "殿堂神作"],
    itemCount: 6,
    movieKeywords: ["星际穿越", "盗梦空间", "奥本海默", "信条", "敦刻尔克", "蝙蝠侠：黑暗骑士"],
    views: 31200,
    likes: 4890,
  },
  {
    id: "pl-mind-twister",
    slug: "mind-twister",
    title: "后背发凉 · 极致高智商反转神作",
    titleEn: "Mind Benders · Unforgiving Plot Twists",
    titleJa: "戦慄のどんでん返し · 天才たちの心理戦",
    subtitle: "不到最后一秒，永远猜不中结局的心理博弈",
    subtitleEn: "Unsettling revelations, unreliable narrators, and spine-chilling deductions",
    subtitleJa: "最後の1秒まで予測不能。張り巡らされた伏線と衝撃の結末",
    description: "每一次眨眼都是线索，每一处台词都有暗号。收集全球悬疑天花板作品，直面人性幽微处的惊悚反转，颠覆你的认知边界。",
    descriptionEn: "Every breath holds a clue. A masterclass in suspense, misdirection, and spine-tingling storytelling that will leave you questioning reality.",
    descriptionJa: "すべての伏線が回収される瞬間、背筋が凍る。世界のミステリー映画の頂点を集結。",
    coverImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    badge: "反转天花板",
    badgeEn: "Twist King",
    badgeJa: "大どんでん返し",
    themeColor: "from-amber-950/70 via-stone-900 to-black",
    accentColor: "#f59e0b",
    tags: ["反转惊悚", "高分悬疑", "密室推理", "智商在线", "豆瓣高分"],
    itemCount: 8,
    movieKeywords: ["肖申克的救赎", "看不见的客人", "消失的她", "禁闭岛", "利刃出鞘", "七宗罪", "记忆碎片", "致命ID"],
    views: 27950,
    likes: 3910,
  },
  {
    id: "pl-shortplay-climax",
    slug: "shortplay-climax",
    title: "战神崛起 · 全网爆款爽剧大赏",
    titleEn: "Sovereign Ascent · Viral Short Drama Hits",
    titleJa: "無双覚醒 · 話題沸騰の超痛快ショートドラマ",
    subtitle: "单集两分钟、绝地反击、打脸逆袭停不下来",
    subtitleEn: "Fast-paced micro dramas, instant revenge, and pure adrenaline rushes",
    subtitleJa: "1話2分の爽快感！大逆転とスカッとする快進撃が止まらない",
    description: "专为手机竖屏碎片时间定制。零拖泥带水，开局即巅峰，隐世战神归来、豪门先婚后爱、小人物逆风翻盘，全网播放量破十亿级爆款集结。",
    descriptionEn: "Tailored for the vertical generation. No filler, pure momentum—billion-view viral micro-dramas in one relentless playlist.",
    descriptionJa: "スキマ時間でサクッと楽しむ9:16縦型ドラマ。どん底からの大逆転劇をイッキ見。",
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    badge: "9:16 爽剧",
    badgeEn: "9:16 Micro",
    badgeJa: "縦型ドラマ",
    themeColor: "from-rose-950/80 via-red-950/40 to-black",
    accentColor: "#f43f5e",
    tags: ["热播短剧", "逆袭战神", "爽感拉满", "分屏互动", "无脑追剧"],
    itemCount: 8,
    movieKeywords: ["授她以柄", "战神", "狂龙", "绝地反击", "闪婚", "千金归来", "无敌", "逆袭"],
    views: 45800,
    likes: 6720,
  },
  {
    id: "pl-laugh-out-loud",
    slug: "laugh-out-loud",
    title: "终极下饭 · 笑出腹肌的爆笑神作",
    titleEn: "Binge & Chuckle · Supreme Comfort Comedies",
    titleJa: "極上コメディ · ご飯のお供に大爆笑の傑作選",
    subtitle: "卸下一天疲惫，无厘头解压、人间清醒合家欢",
    subtitleEn: "Wash away the fatigue with witty punchlines, situational humor and warmth",
    subtitleJa: "一日の疲れを吹き飛ばす、声を出して笑える痛快エンターテインメント",
    description: "干饭必备伴侣！精选无厘头喜剧、黑色幽默与职场讽刺经典，全程密集中高能笑点，专治不开心与日常电量不足。",
    descriptionEn: "The ultimate mealtime companion. Hearty laughs, witty banter, and lighthearted comfort to recharge your spirit.",
    descriptionJa: "美味しいご飯と一緒に楽しむ、とびきりの笑顔と元気をチャージできる名作たち。",
    coverImage: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80",
    badge: "爆笑下饭",
    badgeEn: "Comfort Laughs",
    badgeJa: "爆笑必至",
    themeColor: "from-yellow-950/70 via-amber-950/30 to-black",
    accentColor: "#ffcf32",
    tags: ["爆笑解压", "下饭神器", "经典喜剧", "合家欢", "高能名场面"],
    itemCount: 8,
    movieKeywords: ["武林外传", "年会不能停", "夏洛特烦恼", "西虹市首富", "唐人街探案", "让子弹飞", "九品芝麻官", "功夫"],
    views: 39600,
    likes: 5410,
  },
  {
    id: "pl-healing-anime",
    slug: "healing-anime",
    title: "治愈人间 · 宫崎骏与温暖慢时光",
    titleEn: "Soul Healers · Ghibli & Warm Nostalgia",
    titleJa: "心癒やす風 · ジブリと温もりの物語",
    subtitle: "风吹过麦浪的夏天、温柔的妖怪与童年纯真",
    subtitleEn: "Summer breezes over golden fields, gentle spirits, and timeless wonder",
    subtitleJa: "風が通り抜ける草原、優しいあやかし、いつまでも色褪せない記憶",
    description: "如果世界太喧嚣，就躲进吉卜力的夏日微风里。久石让的琴键流淌，每一帧手绘云朵都蕴含治愈心灵的魔法。",
    descriptionEn: "When reality becomes too loud, retreat into the lush breezes of Miyazaki and Joe Hisaishi. Timeless, tender animation that restores peace.",
    descriptionJa: "ジブリの美しい手描きアニメーションと久石譲の音楽が贈る、疲れた心を優しく包み込むひととき。",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    badge: "温柔治愈",
    badgeEn: "Pure Heart",
    badgeJa: "心温まる",
    themeColor: "from-emerald-950/80 via-teal-950/40 to-black",
    accentColor: "#10b981",
    tags: ["吉卜力", "宫崎骏", "治愈系", "高分动漫", "人间美好"],
    itemCount: 8,
    movieKeywords: ["千与千寻", "龙猫", "哈尔的移动城堡", "幽灵公主", "天空之城", "夏目友人帐", "铃芽之旅", "你的名字"],
    views: 28400,
    likes: 4230,
  },
];

export class PlaylistService {
  /**
   * 获取所有精选片单概览
   */
  async getAllPlaylists(): Promise<ThematicPlaylist[]> {
    return PRESET_PLAYLISTS;
  }

  /**
   * 根据 slug 或 id 获取具体片单详情，并动态聚合匹配真实的影片列表
   */
  async getPlaylistBySlug(slug: string): Promise<ThematicPlaylist | null> {
    const playlist = PRESET_PLAYLISTS.find((p) => p.slug === slug || p.id === slug);
    if (!playlist) return null;

    // 动态拉取片单关联的真实可播影视资源
    const resolvedMovies: MovieItem[] = [];
    const seenIds = new Set<string>();

    for (const kw of playlist.movieKeywords) {
      try {
        const matches = await movieService.searchMovies(kw);
        for (const m of matches) {
          if (!seenIds.has(m.id)) {
            seenIds.add(m.id);
            resolvedMovies.push(m);
            break; // 每个关键词取最贴近的 1 部，保持丰富度
          }
        }
      } catch {
        // ignore
      }
      if (resolvedMovies.length >= playlist.itemCount) break;
    }

    // 若搜索结果不足，补充热门库
    if (resolvedMovies.length < 4) {
      const fallback = await movieService.getHotMovies(playlist.itemCount - resolvedMovies.length);
      for (const m of fallback) {
        if (!seenIds.has(m.id)) {
          seenIds.add(m.id);
          resolvedMovies.push(m);
        }
      }
    }

    return {
      ...playlist,
      movies: resolvedMovies,
      itemCount: resolvedMovies.length,
    };
  }
}

export const playlistService = new PlaylistService();
