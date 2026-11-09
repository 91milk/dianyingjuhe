import { SupportedLocale } from "./config";

export interface Translations {
  common: {
    siteName: string;
    siteSlogan: string;
    searchPlaceholder: string;
    searchButton: string;
    loading: string;
    switchTheme: string;
    switchLanguage: string;
    viewAll: string;
    playNow: string;
    details: string;
    episodes: string;
    directLine: string;
    recommendSource: string;
  };
  nav: {
    home: string;
    movie: string;
    tv: string;
    shortplay: string;
    anime: string;
    variety: string;
    aiSearch: string;
    history: string;
    visionSearch: string;
  };
  home: {
    heroTag: string;
    heroSubtitle: string;
    moodTitle: string;
    moodDesc: string;
    liveUpdatesTitle: string;
    liveUpdatesDesc: string;
    rankingEyebrow: string;
    rankingTitleDouban: string;
    rankingTitleImdb: string;
    rankingDescDouban: string;
    rankingDescImdb: string;
    hotTvsTitle: string;
    hotTvsDesc: string;
    shortPlaysTitle: string;
    shortPlaysDesc: string;
    hotMoviesTitle: string;
    hotMoviesDesc: string;
    animesTitle: string;
    animesDesc: string;
  };
  player: {
    resolvingNotice: string;
    resolvingProgress: string;
    resolvedSuccess: string;
    switchSourceHint: string;
    floatingSwitchTitle: string;
    danmakuInputPlaceholder: string;
    danmakuSend: string;
    danmakuSettings: string;
    danmakuToggleOn: string;
    danmakuToggleOff: string;
    aspectToggleVertical: string;
    aspectToggleHorizontal: string;
    commentsAndEpisodes: string;
    likeCount: string;
    bookmark: string;
    share: string;
  };
}

export const zhCN: Translations = {
  common: {
    siteName: "流量君 AI",
    siteSlogan: "全网影视聚合 · AI 智能找片",
    searchPlaceholder: "搜索电影、剧集、演员...",
    searchButton: "搜索",
    loading: "正在载入...",
    switchTheme: "切换模板风格",
    switchLanguage: "切换语言",
    viewAll: "查看全部",
    playNow: "立即播放",
    details: "影片详情",
    episodes: "选集",
    directLine: "极速直链",
    recommendSource: "豆瓣电影榜",
  },
  nav: {
    home: "首页",
    movie: "电影",
    tv: "电视剧",
    shortplay: "热播短剧",
    anime: "动漫新番",
    variety: "综艺节目",
    aiSearch: "AI 找片",
    history: "播放历史",
    visionSearch: "以图识片",
  },
  home: {
    heroTag: "年度重磅 · 官方精选",
    heroSubtitle: "全网高清直链秒级起播，无广告纯净交互体验",
    moodTitle: "情绪漫游找片",
    moodDesc: "用当下的心境探索影视，触达与你产生共鸣的光影宇宙",
    liveUpdatesTitle: "今日全网实时更新",
    liveUpdatesDesc: "连接多资源站最新入库内容，刚刚更新的剧集第一时间呈现",
    rankingEyebrow: "Audience Ranking",
    rankingTitleDouban: "豆瓣高分口碑榜",
    rankingTitleImdb: "IMDb / TMDB 全球高分榜",
    rankingDescDouban: "引用豆瓣电影 TOP 权威经典，经久不衰的影史丰碑神作",
    rankingDescImdb: "引用全球观众与影评人口碑榜，精选影史评分最高的大师杰作",
    hotTvsTitle: "热门连载电视剧",
    hotTvsDesc: "国产大剧、欧美精选与高口碑悬疑，持续同步最新进度",
    shortPlaysTitle: "爆款微短剧",
    shortPlaysDesc: "短、快、直接进入情绪高点。都市逆袭与高能爽剧集中呈现",
    hotMoviesTitle: "院线与热映电影",
    hotMoviesDesc: "动作、科幻、奇幻与剧情，把大银幕的新鲜感带到每一次播放",
    animesTitle: "国漫与高燃新番",
    animesDesc: "玄幻仙侠、热血战斗与季度新番，追更不错过每一次更新",
  },
  player: {
    resolvingNotice: "正在为您优选全网高清播放线路...",
    resolvingProgress: "并发多源竞速探测中...",
    resolvedSuccess: "优质线路已就绪，秒级极速起播",
    switchSourceHint: "线路切换请点击播放器右上角",
    floatingSwitchTitle: "切换播放线路",
    danmakuInputPlaceholder: "发条弹幕参与互动...",
    danmakuSend: "发送",
    danmakuSettings: "弹幕参数设置",
    danmakuToggleOn: "弹幕开",
    danmakuToggleOff: "弹幕关",
    aspectToggleVertical: "竖屏 9:16",
    aspectToggleHorizontal: "横屏 16:9",
    commentsAndEpisodes: "选集与弹幕互动",
    likeCount: "点赞",
    bookmark: "追剧收藏",
    share: "分享",
  },
};

export const enUS: Translations = {
  common: {
    siteName: "LiuLiangJun AI",
    siteSlogan: "Global Cinema Streaming · AI Movie Finder",
    searchPlaceholder: "Search movies, series, actors...",
    searchButton: "Search",
    loading: "Loading...",
    switchTheme: "Switch Theme",
    switchLanguage: "Change Language",
    viewAll: "View All",
    playNow: "Play Now",
    details: "Details",
    episodes: "Episodes",
    directLine: "Fast Direct",
    recommendSource: "IMDb / TMDB Top",
  },
  nav: {
    home: "Home",
    movie: "Movies",
    tv: "TV Series",
    shortplay: "Short Drama",
    anime: "Animation",
    variety: "Shows",
    aiSearch: "AI Search",
    history: "History",
    visionSearch: "Visual Search",
  },
  home: {
    heroTag: "Featured Masterpiece",
    heroSubtitle: "Blazing fast streaming with clean, ad-free viewing experience",
    moodTitle: "Mood Cinema Journey",
    moodDesc: "Explore cinema curated by your current vibe and emotional resonance",
    liveUpdatesTitle: "Real-time Daily Updates",
    liveUpdatesDesc: "Connected with multi-source feeds, bringing the latest episodes instantly",
    rankingEyebrow: "Global Audience Ranking",
    rankingTitleDouban: "Douban Top Rated",
    rankingTitleImdb: "IMDb / TMDB Global Top Rated",
    rankingDescDouban: "Curated legendary cinema acclaimed by millions of movie lovers",
    rankingDescImdb: "World-renowned masterpieces holding the highest international critical acclaim",
    hotTvsTitle: "Trending TV Series",
    hotTvsDesc: "Global hit dramas, thrillers and sci-fi series with up-to-date episodes",
    shortPlaysTitle: "Viral Short Dramas",
    shortPlaysDesc: "Fast-paced, high-tension bite-sized dramas in 9:16 vertical immersion",
    hotMoviesTitle: "Blockbusters & In Theaters",
    hotMoviesDesc: "Action, sci-fi, thriller and fantasy delivered directly to your screen",
    animesTitle: "Anime & New Releases",
    animesDesc: "Top seasonal anime and epic animated sagas updated in real time",
  },
  player: {
    resolvingNotice: "Resolving fastest HD streaming sources...",
    resolvingProgress: "Racing multi-provider connections...",
    resolvedSuccess: "Optimal line ready. Playing now",
    switchSourceHint: "Click top-right icon to switch providers",
    floatingSwitchTitle: "Switch Stream Source",
    danmakuInputPlaceholder: "Send a live bullet comment...",
    danmakuSend: "Send",
    danmakuSettings: "Danmaku Settings",
    danmakuToggleOn: "Danmaku On",
    danmakuToggleOff: "Danmaku Off",
    aspectToggleVertical: "Vertical 9:16",
    aspectToggleHorizontal: "Widescreen 16:9",
    commentsAndEpisodes: "Episodes & Live Chat",
    likeCount: "Like",
    bookmark: "Bookmark",
    share: "Share",
  },
};

export const jaJP: Translations = {
  common: {
    siteName: "流量君 AI",
    siteSlogan: "動画アグリゲーション · AI映画レコメンド",
    searchPlaceholder: "映画、ドラマ、出演者を検索...",
    searchButton: "検索",
    loading: "読み込み中...",
    switchTheme: "テーマ切替",
    switchLanguage: "言語切替",
    viewAll: "すべて見る",
    playNow: "今すぐ再生",
    details: "作品詳細",
    episodes: "エピソード",
    directLine: "高速直結",
    recommendSource: "Filmarks / IMDb ランキング",
  },
  nav: {
    home: "ホーム",
    movie: "映画",
    tv: "ドラマ",
    shortplay: "ショートドラマ",
    anime: "アニメ",
    variety: "バラエティ",
    aiSearch: "AI検索",
    history: "再生履歴",
    visionSearch: "画像で検索",
  },
  home: {
    heroTag: "注目の名作 · ピックアップ",
    heroSubtitle: "超高速ストリーミング、広告なしの快適な視聴体験を提供",
    moodTitle: "気分で探す映画旅",
    moodDesc: "いまの気分や感情に合わせて、ぴったりの名作と出会う",
    liveUpdatesTitle: "本日の最新リアルタイム更新",
    liveUpdatesDesc: "複数配信ソースと連動し、最新エピソードをいち早くお届け",
    rankingEyebrow: "Audience Ranking",
    rankingTitleDouban: "豆瓣（Douban）高評価ランキング",
    rankingTitleImdb: "IMDb / TMDB 世界歴代名作ランキング",
    rankingDescDouban: "映画ファンに愛され続ける不朽の名作映画コレクション",
    rankingDescImdb: "世界中の映画ファンと評論家から絶賛された歴代最高峰の映画傑作",
    hotTvsTitle: "人気配信ドラマシリーズ",
    hotTvsDesc: "話題のサスペンスや本格海外ドラマの最新話を継続更新",
    shortPlaysTitle: "話題の縦型ショートドラマ",
    shortPlaysDesc: "短時間でテンポよく感情揺さぶる9:16スマホ特化型ドラマ",
    hotMoviesTitle: "劇場公開＆話題の最新映画",
    hotMoviesDesc: "アクション、SF、ファンタジーの最新劇場作をいつでも視聴可能",
    animesTitle: "新作アニメ＆注目タイトル",
    animesDesc: "最新のシーズンアニメや熱血バトル作品をリアルタイム追従",
  },
  player: {
    resolvingNotice: "高速HD再生ソースを最適化中...",
    resolvingProgress: "複数回線を並行接続テスト中...",
    resolvedSuccess: "最適な回線が見つかりました。再生を開始します",
    switchSourceHint: "右上のボタンから再生回線を切り替えられます",
    floatingSwitchTitle: "再生回線切り替え",
    danmakuInputPlaceholder: "コメントを流す...",
    danmakuSend: "送信",
    danmakuSettings: "弾幕設定",
    danmakuToggleOn: "弾幕 ON",
    danmakuToggleOff: "弾幕 OFF",
    aspectToggleVertical: "縦画面 9:16",
    aspectToggleHorizontal: "横画面 16:9",
    commentsAndEpisodes: "エピソード＆コメント",
    likeCount: "高評価",
    bookmark: "お気に入り",
    share: "共有",
  },
};

export const TRANSLATIONS: Record<SupportedLocale, Translations> = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": jaJP,
};
