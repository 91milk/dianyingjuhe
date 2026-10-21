export const siteConfig = {
  name: "懂片聚合 (DongPian AI)",
  shortName: "懂片AI",
  description: "新一代智能影视聚合助手，支持 AI 模糊找片、情绪找片、以图识片与全网聚合多线路播放",
  themeColor: "#ffcf32",
  navItems: [
    { title: "首页", href: "/" },
    { title: "电影", href: "/category?type=movie" },
    { title: "电视剧", href: "/category?type=tv" },
    { title: "热播短剧", href: "/category?type=shortplay" },
    { title: "动漫", href: "/category?type=anime" },
    { title: "综艺", href: "/category?type=variety" },
  ],
  modules: {
    enableAiChat: true,      // 启用 AI 对话找片
    enableVisionSearch: true, // 启用以图搜片
    enableHistory: true,     // 启用播放历史记录
    enableShortPlay: true,   // 启用微短剧专区
    enableMultiSource: true, // 启用多线路解析切换
  },
};
