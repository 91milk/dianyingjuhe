import { MovieItem } from "../types";
import { SupportedLocale } from "@/i18n/config";

// 常见多语言片名映射表 (英/日/中)
export const TITLE_I18N: Record<string, { en: string; ja: string }> = {
  "肖申克的救赎": { en: "The Shawshank Redemption", ja: "ショーシャンクの空に" },
  "教父": { en: "The Godfather", ja: "ゴッドファーザー" },
  "黑暗骑士": { en: "The Dark Knight", ja: "ダークナイト" },
  "辛德勒的名单": { en: "Schindler's List", ja: "シンドラーのリスト" },
  "指环王3：王者无敌": { en: "The Lord of the Rings: The Return of the King", ja: "ロード・オブ・ザ・リング/王の帰還" },
  "星际穿越": { en: "Interstellar", ja: "インターステラー" },
  "盗梦空间": { en: "Inception", ja: "インセプション" },
  "低俗小说": { en: "Pulp Fiction", ja: "パルプ・フィクション" },
  "黑客帝国": { en: "The Matrix", ja: "マトリックス" },
  "千与千寻": { en: "Spirited Away", ja: "千と千尋の神隠し" },
  "奥本海默": { en: "Oppenheimer", ja: "オッペンハイマー" },
  "沙丘2": { en: "Dune: Part Two", ja: "デューン 砂の惑星PART2" },
  "泰坦尼克号": { en: "Titanic", ja: "タイタニック" },
  "阿甘正传": { en: "Forrest Gump", ja: "フォレスト・ガンプ/一期一会" },
  "美丽人生": { en: "Life is Beautiful", ja: "ライフ・イズ・ビューティフル" },
  "霸王别姬": { en: "Farewell My Concubine", ja: "さらば、わが愛/覇王別姫" },
  "抓娃娃": { en: "Successor", ja: "サクセサー" },
  "默杀": { en: "A Place Called Silence", ja: "黙殺" },
  "死侍与金刚": { en: "Deadpool & Wolverine", ja: "デッドプール＆ウルヴァリン" },
  "楚门的世界": { en: "The Truman Show", ja: "トゥルーマン・ショー" },
  "这个杀手不太冷": { en: "Léon: The Professional", ja: "レオン" },
  "间谍过家家": { en: "SPY×FAMILY", ja: "SPY×FAMILY" },
};

const GENRE_I18N: Record<string, { en: string; ja: string }> = {
  "剧情": { en: "Drama", ja: "ドラマ" },
  "动作": { en: "Action", ja: "アクション" },
  "科幻": { en: "Sci-Fi", ja: "SF" },
  "犯罪": { en: "Crime", ja: "クライム" },
  "悬疑": { en: "Mystery", ja: "サスペンス" },
  "喜剧": { en: "Comedy", ja: "コメディ" },
  "爱情": { en: "Romance", ja: "ロマンス" },
  "冒险": { en: "Adventure", ja: "アドベンチャー" },
  "奇幻": { en: "Fantasy", ja: "ファンタジー" },
  "动画": { en: "Animation", ja: "アニメ" },
  "惊悚": { en: "Thriller", ja: "スリラー" },
  "战争": { en: "War", ja: "戦争" },
  "历史": { en: "History", ja: "歴史" },
  "传记": { en: "Biography", ja: "伝記" },
};

const REGION_I18N: Record<string, { en: string; ja: string }> = {
  "美国": { en: "USA", ja: "アメリカ" },
  "中国大陆": { en: "China", ja: "中国" },
  "中国香港": { en: "Hong Kong", ja: "香港" },
  "中国台湾": { en: "Taiwan", ja: "台湾" },
  "日本": { en: "Japan", ja: "日本" },
  "韩国": { en: "Korea", ja: "韓国" },
  "英国": { en: "UK", ja: "イギリス" },
  "法国": { en: "France", ja: "フランス" },
  "德国": { en: "Germany", ja: "ドイツ" },
  "意大利": { en: "Italy", ja: "イタリア" },
};

/**
 * 根据用户的当前语言动态本地化影片展示元数据
 */
export function getLocalizedMovie(movie: MovieItem, locale: SupportedLocale = "zh-CN"): MovieItem {
  if (locale === "zh-CN") {
    return movie;
  }

  const isEn = locale === "en-US";
  const mappedTitle = TITLE_I18N[movie.title];
  const localizedTitle = isEn
    ? (mappedTitle?.en || movie.originalTitle || movie.title)
    : (mappedTitle?.ja || movie.originalTitle || movie.title);

  const localizedGenres = movie.genres.map((g) => {
    const hit = GENRE_I18N[g];
    return hit ? (isEn ? hit.en : hit.ja) : g;
  });

  const hitRegion = REGION_I18N[movie.region];
  const localizedRegion = hitRegion ? (isEn ? hitRegion.en : hitRegion.ja) : movie.region;

  // 本地化更新状态角标
  let localizedStatus = movie.updateStatus;
  if (localizedStatus) {
    if (localizedStatus.includes("4K")) {
      localizedStatus = isEn ? "4K Ultra HD" : "4K高画質";
    } else if (localizedStatus.includes("全") || localizedStatus.includes("完结")) {
      localizedStatus = isEn ? "Complete Series" : "全話配信中";
    }
  }

  return {
    ...movie,
    title: localizedTitle,
    genres: localizedGenres,
    region: localizedRegion,
    updateStatus: localizedStatus,
  };
}

/**
 * 双向跨语言片名协同检索：
 * 当用户或接口使用外文片名 (如 "The Dark Knight"、"Oppenheimer"、"Interstellar" 等) 检索时，
 * 自动提取出其关联的标准中文名，保证无论用哪种语言搜索，都能精准命中上游各大采集站的超清资源！
 */
export function getMultilingualSearchKeywords(query: string): string[] {
  if (!query) return [];
  const q = query.trim().toLowerCase();
  const keywords = new Set<string>();
  keywords.add(query.trim());

  for (const [cnTitle, trans] of Object.entries(TITLE_I18N)) {
    if (
      cnTitle.toLowerCase() === q ||
      trans.en.toLowerCase() === q ||
      trans.ja.toLowerCase() === q ||
      trans.en.toLowerCase().includes(q) ||
      q.includes(trans.en.toLowerCase())
    ) {
      keywords.add(cnTitle);
      keywords.add(trans.en);
    }
  }

  return Array.from(keywords);
}

