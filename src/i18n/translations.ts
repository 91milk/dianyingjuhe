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
    cardDetail: string;
    cardPlay: string;
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
    playlists: string;
    aiSearch: string;
    history: string;
    visionSearch: string;
  };
  home: {
    heroTag: string;
    heroSubtitle: string;
    editorialFeature: string;
    aiInsight: string;
    playFeaturedBt: string;
    viewArchiveBt: string;
    nowScreening: string;
    moodBadge: string;
    moodTitle: string;
    moodDesc: string;
    moodShuffle: string;
    playlistsTitle: string;
    playlistsBadge: string;
    playlistsDesc: string;
    playlistsMore: string;
    aiFindTitle: string;
    aiFindDesc: string;
    aiFindPlaceholder: string;
    liveUpdatesTitle: string;
    liveUpdatesBadge: string;
    liveUpdatesDesc: string;
    liveUpdatesMore: string;
    rankingEyebrow: string;
    rankingTitleDouban: string;
    rankingTitleImdb: string;
    rankingDescDouban: string;
    rankingDescImdb: string;
    hotTvsTitle: string;
    hotTvsBadge: string;
    hotTvsDesc: string;
    hotTvsMore: string;
    shortPlaysTitle: string;
    shortPlaysBadge: string;
    shortPlaysDesc: string;
    shortPlaysMore: string;
    hotMoviesTitle: string;
    hotMoviesBadge: string;
    hotMoviesDesc: string;
    hotMoviesMore: string;
    animesTitle: string;
    animesBadge: string;
    animesDesc: string;
    animesMore: string;
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
    currentLine: string;
    totalSources: string;
    racingNotice: string;
    episodesTitle: string;
    episodesTotal: string;
    prevEpisode: string;
    nextEpisode: string;
    switchSource: string;
    sourceCount: string;
    sourceClickTip: string;
    sourceHelpTip: string;
    rating: string;
    director: string;
    cast: string;
    synopsis: string;
    aiPlotSummary: string;
    aiGenerating: string;
    moreLikeThis: string;
    shortDramaCinema: string;
    shortDramaSubtitle: string;
    commentTab: string;
    danmakuColorAndPos: string;
    danmakuScroll: string;
    danmakuTop: string;
    danmakuBottom: string;
    danmakuDisplaySettings: string;
    danmakuOpacity: string;
    danmakuFontSize: string;
    danmakuArea: string;
    danmakuSpeed: string;
    danmakuSizeSm: string;
    danmakuSizeMd: string;
    danmakuSizeLg: string;
    danmakuAreaQuarter: string;
    danmakuAreaHalf: string;
    danmakuAreaFull: string;
    danmakuSpeedSlow: string;
    danmakuSpeedNormal: string;
    danmakuSpeedFast: string;
    webParsingPlay: string;
    switchNativePlay: string;
    webFallbackPlay: string;
    playErrorHint: string;
  };
  footer: {
    slogan: string;
    multiSource: string;
    aiChat: string;
    visualSearch: string;
    switchToClassic: string;
    switchToModern: string;
    admin: string;
    floatAiButton: string;
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
    playNow: "立即播放正片",
    details: "影评与看点档案",
    cardDetail: "查看详情",
    cardPlay: "立即播放",
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
    playlists: "精选片单",
    aiSearch: "AI 找片",
    history: "播放历史",
    visionSearch: "以图识片",
  },
  home: {
    heroTag: "年度重磅 · 官方精选",
    heroSubtitle: "全网高清直链秒级起播，无广告纯净交互体验",
    editorialFeature: "官方重磅精选",
    aiInsight: "AI 观影提示：",
    playFeaturedBt: "立即播放正片",
    viewArchiveBt: "影评与看点档案",
    nowScreening: "正在展映推荐",
    moodBadge: "AI 情绪找片",
    moodTitle: "情绪场景与灵感选片舱",
    moodDesc: "用当下的心境探索影视，触达与你产生共鸣的光影宇宙",
    moodShuffle: "换一批",
    playlistsTitle: "懂片精选 · 专题片单",
    playlistsBadge: "更懂你的片单",
    playlistsDesc: "资深影迷深度主题策展 · 午夜放映室与高分合辑一键开播",
    playlistsMore: "片单广场",
    aiFindTitle: "不知道看什么？用一句话描述你的观影心情",
    aiFindDesc: "支持模糊情绪、剧情反转、特定题材与全网超清片库秒级联查",
    aiFindPlaceholder: "例如：想看反转不断、紧张到不敢呼吸的悬疑高分神作...",
    liveUpdatesTitle: "今日全网实时更新",
    liveUpdatesBadge: "实时同步",
    liveUpdatesDesc: "8大采集站极速入库 · 连载追更零时差 · 超清直连播放",
    liveUpdatesMore: "查看更新库",
    rankingEyebrow: "Audience Ranking",
    rankingTitleDouban: "豆瓣高分热搜口碑榜",
    rankingTitleImdb: "IMDb / TMDB 全球高分榜",
    rankingDescDouban: "引用豆瓣电影 TOP 权威经典，经久不衰的影史丰碑神作",
    rankingDescImdb: "引用全球观众与影评人口碑榜，精选影史评分最高的大师杰作",
    hotTvsTitle: "热门连载电视剧",
    hotTvsBadge: "追剧必看",
    hotTvsDesc: "国产大剧 · 欧美精选 · 悬疑探案 · 同步连载更新",
    hotTvsMore: "全部剧集",
    shortPlaysTitle: "爆款微短剧爽剧快车道",
    shortPlaysBadge: "HOT 爽剧",
    shortPlaysDesc: "现代都市 · 逆袭打脸 · 战神归来 · 甜宠古装全集",
    shortPlaysMore: "短剧专区",
    hotMoviesTitle: "最新院线大片与热映电影",
    hotMoviesBadge: "超清正片",
    hotMoviesDesc: "动作犯罪 · 科幻奇幻 · 院线公映 · 抢先超清画质",
    hotMoviesMore: "更多大片",
    animesTitle: "顶流国漫与高燃新番",
    animesBadge: "二次元热搜",
    animesDesc: "玄幻仙侠 · 热血战斗 · 季番连载 · 视效盛宴",
    animesMore: "全部动漫",
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
    currentLine: "当前线路",
    totalSources: "全网共聚合 {count} 条播放源",
    racingNotice: "并发竞速 · 线路切换请点击播放器右上角",
    episodesTitle: "剧集选集",
    episodesTotal: "共 {count} 集",
    prevEpisode: "上一集",
    nextEpisode: "下一集",
    switchSource: "切换播放线路",
    sourceCount: "共 {count} 条",
    sourceClickTip: "点击目标线路立即开播并自动收起",
    sourceHelpTip: "若卡顿或解析失败请切换其他线路",
    rating: "综合评分",
    director: "导演",
    cast: "主演阵容",
    synopsis: "剧情简介",
    aiPlotSummary: "AI 剧情速览与看点",
    aiGenerating: "AI 正在为本片生成深度情节剖析...",
    moreLikeThis: "喜欢这部作品的影迷还在看",
    shortDramaCinema: "微短剧沉浸影院",
    shortDramaSubtitle: "专享左右分屏极简布局 · 左侧竖屏高清视窗 · 右侧剧情档案与互动弹幕",
    commentTab: "剧评 / 弹幕",
    danmakuColorAndPos: "弹幕色彩与位置",
    danmakuScroll: "滚动",
    danmakuTop: "顶端",
    danmakuBottom: "底端",
    danmakuDisplaySettings: "弹幕显示设置",
    danmakuOpacity: "不透明度",
    danmakuFontSize: "字体大小",
    danmakuArea: "显示防挡屏",
    danmakuSpeed: "弹幕速度",
    danmakuSizeSm: "小",
    danmakuSizeMd: "中",
    danmakuSizeLg: "大",
    danmakuAreaQuarter: "1/4屏",
    danmakuAreaHalf: "半屏",
    danmakuAreaFull: "全屏",
    danmakuSpeedSlow: "平缓",
    danmakuSpeedNormal: "适中",
    danmakuSpeedFast: "快速",
    webParsingPlay: "网页解析播放中",
    switchNativePlay: "切换原生播放",
    webFallbackPlay: "网页兼容播放",
    playErrorHint: "播放异常，正在为您尝试备用线路...",
  },
  footer: {
    slogan: "基于 AI 驱动的影视聚合与发现平台",
    multiSource: "多源超清播放",
    aiChat: "AI 对话找片",
    visualSearch: "以图识片",
    switchToClassic: "切换至经典版",
    switchToModern: "体验先锋版",
    admin: "管理",
    floatAiButton: "AI 影视助手",
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
    details: "Reviews & Highlights",
    cardDetail: "Details",
    cardPlay: "Play",
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
    playlists: "Playlists",
    aiSearch: "AI Search",
    history: "History",
    visionSearch: "Visual Search",
  },
  home: {
    heroTag: "Featured Masterpiece",
    heroSubtitle: "Blazing fast streaming with clean, ad-free viewing experience",
    editorialFeature: "Editorial Feature",
    aiInsight: "AI Insight: ",
    playFeaturedBt: "Watch Now",
    viewArchiveBt: "Reviews & Archive",
    nowScreening: "Now Screening",
    moodBadge: "AI Mood Explorer",
    moodTitle: "Mood Cinema Journey",
    moodDesc: "Explore cinema curated by your current vibe and emotional resonance",
    moodShuffle: "Shuffle",
    playlistsTitle: "Curated Playlists",
    playlistsBadge: "Deep Cinema",
    playlistsDesc: "Handcrafted thematic retrospectives · Midnight cinema and masterpieces",
    playlistsMore: "Playlists Square",
    aiFindTitle: "Not sure what to watch? Tell us your mood in one sentence",
    aiFindDesc: "Supports natural language mood matching, plot twists, genres and global streaming catalog",
    aiFindPlaceholder: "e.g., Mind-bending sci-fi with intense plot twists...",
    liveUpdatesTitle: "Real-time Daily Updates",
    liveUpdatesBadge: "Live Synced",
    liveUpdatesDesc: "Connected with multi-source feeds, bringing the latest episodes instantly",
    liveUpdatesMore: "View All Updates",
    rankingEyebrow: "Global Audience Ranking",
    rankingTitleDouban: "Douban Top Rated",
    rankingTitleImdb: "IMDb / TMDB Global Top Rated",
    rankingDescDouban: "Curated legendary cinema acclaimed by millions of movie lovers",
    rankingDescImdb: "World-renowned masterpieces holding the highest international critical acclaim",
    hotTvsTitle: "Trending TV Series",
    hotTvsBadge: "Must Watch",
    hotTvsDesc: "Global hit dramas, thrillers and sci-fi series with up-to-date episodes",
    hotTvsMore: "All Series",
    shortPlaysTitle: "Viral Short Dramas",
    shortPlaysBadge: "HOT Shorts",
    shortPlaysDesc: "Fast-paced, high-tension bite-sized dramas in 9:16 vertical immersion",
    shortPlaysMore: "Short Dramas",
    hotMoviesTitle: "Blockbusters & In Theaters",
    hotMoviesBadge: "HD Direct",
    hotMoviesDesc: "Action, sci-fi, thriller and fantasy delivered directly to your screen",
    hotMoviesMore: "More Movies",
    animesTitle: "Anime & New Releases",
    animesBadge: "Trending Anime",
    animesDesc: "Top seasonal anime and epic animated sagas updated in real time",
    animesMore: "All Anime",
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
    currentLine: "Current Line",
    totalSources: "{count} sources aggregated",
    racingNotice: "Fast Racing · Click top-right to switch lines",
    episodesTitle: "Episodes",
    episodesTotal: "{count} Episodes",
    prevEpisode: "Prev Episode",
    nextEpisode: "Next Episode",
    switchSource: "Switch Provider",
    sourceCount: "{count} Lines",
    sourceClickTip: "Select provider to play and auto-close",
    sourceHelpTip: "Switch source if video lags or fails to buffer",
    rating: "Rating",
    director: "Director",
    cast: "Cast",
    synopsis: "Synopsis",
    aiPlotSummary: "AI Plot & Highlights",
    aiGenerating: "AI is generating plot insights for this title...",
    moreLikeThis: "More Like This",
    shortDramaCinema: "Short Play Cinema",
    shortDramaSubtitle: "9:16 Vertical Immersive Stream · Interactive Live Chat & Episode Deck",
    commentTab: "Chat / Reviews",
    danmakuColorAndPos: "Barrage Style & Position",
    danmakuScroll: "Scroll",
    danmakuTop: "Top",
    danmakuBottom: "Bottom",
    danmakuDisplaySettings: "Danmaku Settings",
    danmakuOpacity: "Opacity",
    danmakuFontSize: "Font Size",
    danmakuArea: "Display Area",
    danmakuSpeed: "Scroll Speed",
    danmakuSizeSm: "Small",
    danmakuSizeMd: "Medium",
    danmakuSizeLg: "Large",
    danmakuAreaQuarter: "Top 1/4",
    danmakuAreaHalf: "Half",
    danmakuAreaFull: "Full",
    danmakuSpeedSlow: "Slow",
    danmakuSpeedNormal: "Normal",
    danmakuSpeedFast: "Fast",
    webParsingPlay: "Web Embedded Stream",
    switchNativePlay: "Switch to Native Player",
    webFallbackPlay: "Switch to Web Player",
    playErrorHint: "Playback issue detected, trying backup stream...",
  },
  footer: {
    slogan: "Next-generation AI-powered streaming and cinema discovery platform",
    multiSource: "Multi-Source Streaming",
    aiChat: "AI Conversational Search",
    visualSearch: "Visual Search",
    switchToClassic: "Classic Mode",
    switchToModern: "Modern Mode",
    admin: "Admin",
    floatAiButton: "AI Cinema Bot",
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
    playNow: "今すぐ本編再生",
    details: "レビューと作品情報",
    cardDetail: "詳細を見る",
    cardPlay: "再生",
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
    playlists: "プレイリスト",
    aiSearch: "AI検索",
    history: "再生履歴",
    visionSearch: "画像で検索",
  },
  home: {
    heroTag: "注目の名作 · ピックアップ",
    heroSubtitle: "超高速ストリーミング、広告なしの快適な視聴体験を提供",
    editorialFeature: "編集部おすすめ",
    aiInsight: "AI解説: ",
    playFeaturedBt: "今すぐ本編再生",
    viewArchiveBt: "レビューと作品情報",
    nowScreening: "おすすめ上映中",
    moodBadge: "AI気分検索",
    moodTitle: "気分で探す映画旅",
    moodDesc: "いまの気分や感情に合わせて、ぴったりの名作と出会う",
    moodShuffle: "シャッフル",
    playlistsTitle: "厳選プレイリスト",
    playlistsBadge: "テーマ特選",
    playlistsDesc: "深夜シネマ、超難解サスペンス、話題の縦型ドラマを網羅",
    playlistsMore: "プレイリスト広場",
    aiFindTitle: "何を見るか迷ったら？いまの気分を一言で",
    aiFindDesc: "感情、どんでん返し、ジャンルから全ネット動画を一瞬で横断検索",
    aiFindPlaceholder: "例：息をのむ大どんでん返しのあるSFサスペンス...",
    liveUpdatesTitle: "本日の最新リアルタイム更新",
    liveUpdatesBadge: "リアルタイム",
    liveUpdatesDesc: "複数配信ソースと連動し、最新エピソードをいち早くお届け",
    liveUpdatesMore: "最新更新一覧",
    rankingEyebrow: "Audience Ranking",
    rankingTitleDouban: "豆瓣（Douban）高評価ランキング",
    rankingTitleImdb: "IMDb / TMDB 世界歴代名作ランキング",
    rankingDescDouban: "映画ファンに愛され続ける不朽の名作映画コレクション",
    rankingDescImdb: "世界中の映画ファンと評論家から絶賛された歴代最高峰の映画傑作",
    hotTvsTitle: "人気配信ドラマシリーズ",
    hotTvsBadge: "見逃し厳禁",
    hotTvsDesc: "話題のサスペンスや本格海外ドラマの最新話を継続更新",
    hotTvsMore: "全ドラマ",
    shortPlaysTitle: "話題の縦型ショートドラマ",
    shortPlaysBadge: "HOT ショート",
    shortPlaysDesc: "短時間でテンポよく感情揺さぶる9:16スマホ特化型ドラマ",
    shortPlaysMore: "ショートドラマ",
    hotMoviesTitle: "劇場公開＆話題の最新映画",
    hotMoviesBadge: "超高画質",
    hotMoviesDesc: "アクション、SF、ファンタジーの最新劇場作をいつでも視聴可能",
    hotMoviesMore: "映画をもっと見る",
    animesTitle: "新作アニメ＆注目タイトル",
    animesBadge: "注目アニメ",
    animesDesc: "最新のシーズンアニメや熱血バトル作品をリアルタイム追従",
    animesMore: "全アニメ一覧",
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
    currentLine: "現在の回線",
    totalSources: "合計 {count} 系統の配信ソースを統合",
    racingNotice: "並行テスト中 · 回线変更はプレイヤー右上へ",
    episodesTitle: "エピソード一覧",
    episodesTotal: "全 {count} 話",
    prevEpisode: "前の話",
    nextEpisode: "次の話",
    switchSource: "再生回線の切り替え",
    sourceCount: "全 {count} 系統",
    sourceClickTip: "選択すると即座に再生を開始します",
    sourceHelpTip: "読み込みが遅い場合は別の回線をお試しください",
    rating: "評価",
    director: "監督",
    cast: "キャスト",
    synopsis: "あらすじ",
    aiPlotSummary: "AI ストーリー解説＆見どころ",
    aiGenerating: "AIがあらすじと見どころを分析中です...",
    moreLikeThis: "この作品を見た人におすすめ",
    shortDramaCinema: "縦型ショートドラマシアター",
    shortDramaSubtitle: "9:16縦画面スマホ最適化 · 左右分割＆リアルタイム弾幕コメント",
    commentTab: "コメント / 弾幕",
    danmakuColorAndPos: "弾幕カラー＆表示位置",
    danmakuScroll: "スクロール",
    danmakuTop: "上部固定",
    danmakuBottom: "下部固定",
    danmakuDisplaySettings: "弾幕表示設定",
    danmakuOpacity: "不透明度",
    danmakuFontSize: "フォントサイズ",
    danmakuArea: "表示領域",
    danmakuSpeed: "流れる速度",
    danmakuSizeSm: "小",
    danmakuSizeMd: "中",
    danmakuSizeLg: "大",
    danmakuAreaQuarter: "上部1/4",
    danmakuAreaHalf: "半分",
    danmakuAreaFull: "全画面",
    danmakuSpeedSlow: "ゆっくり",
    danmakuSpeedNormal: "標準",
    danmakuSpeedFast: "高速",
    webParsingPlay: "Web埋め込み再生中",
    switchNativePlay: "ネイティブ再生へ切り替え",
    webFallbackPlay: "Web互換再生へ切り替え",
    playErrorHint: "再生に問題が発生しました。代替回線を試行中...",
  },
  footer: {
    slogan: "AI駆動の次世代動画アグリゲーション＆映画発見プラットフォーム",
    multiSource: "複数ソース高速配信",
    aiChat: "AI対話レコメンド",
    visualSearch: "画像で作品検索",
    switchToClassic: "クラシック版へ切替",
    switchToModern: "モダン版へ切替",
    admin: "管理",
    floatAiButton: "AI映画アシスタント",
  },
};

export const TRANSLATIONS: Record<SupportedLocale, Translations> = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": jaJP,
};
