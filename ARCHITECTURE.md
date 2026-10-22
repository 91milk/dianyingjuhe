# 流量君 AI - 模块化架构与功能扩展指南

本项目采用现代化 **Next.js 16 (App Router) + TypeScript + TailwindCSS 4 + ArtPlayer + HLS.js** 全栈开发，具备高聚合度、低耦合度的**特性模块化设计 (Feature-based Modular Architecture)**，极大方便后续增添任何功能。

---

## 目录与功能模块结构

```
src/
├── config/
│   └── site.ts               # 全局站点配置、品牌主题色、模块开闭开关
├── modules/                  # 核心高内聚业务模块
│   ├── movie/                # 影视核心模块（分类、筛选、聚合列表、Mock/数据库服务）
│   │   ├── types.ts          # 影视数据实体模型定义
│   │   ├── services/         # 数据层抽象 (movieService.ts / mockData.ts)
│   │   └── components/       # 海报卡片、网格、多维筛选器
│   ├── player/               # 播放器与多线路解析模块
│   │   ├── types.ts          # 播放器配置与播放进度协议
│   │   ├── adapters/         # 采集与播放源适配器（如 AppleCMS 苹果采集站解析）
│   │   └── components/       # ArtPlayer 沉浸播放器、线路切换器、选集器
│   ├── ai-chat/              # AI 智能找片对话模块 (懂片核心)
│   │   ├── types.ts          # 消息协议与影视卡片推荐结构
│   │   ├── services/         # 意图理解、剧情模糊召回引擎 (aiService.ts)
│   │   └── components/       # 仿懂片帝右侧交互抽屉、对话流内嵌影视推荐卡片
│   ├── ai-vision/            # AI 以图找片 / 剧照识别模块
│   │   ├── types.ts          # 识图请求与识别结果协议
│   │   ├── services/         # 视觉模型分析服务接口 (visionService.ts)
│   │   └── components/       # 图片拖拽上传与名场面匹配结果弹窗
│   └── user/                 # 用户偏好与观影历史模块
│       ├── types.ts          # 历史播放进度数据结构
│       ├── services/         # 本地缓存持久化服务 (historyService.ts)
│       └── components/       # 侧边观影进度追溯抽屉
├── app/                      # Next.js App Router 路由层
│   ├── page.tsx              # 首页 (焦点 Hero Banner、热门电影、爆款微短剧专区、电视剧、动漫)
│   ├── watch/[id]/           # 播放详情页 (HLS播放器、多线路切换、选集、AI 看点分析、相似推荐)
│   ├── category/             # 资源库多维筛选与搜索结果页
│   └── api/                  # 模块化对外 API 路由 (AI 对话接口、影视列表接口)
└── components/               # 全局 Shell 布局与导航栏
```

---

## 如何轻松扩展功能

### 1. 接入外部影视采集站或真实数据库 (CMS / PostgreSQL)
在 `src/modules/movie/services/movieService.ts` 中：
- `movieService` 封装了标准的 `getMovieById`, `filterMovies`, `searchMovies` 等方法。
- 你只需在此服务中将数据源从 `mockData` 替换为数据库 ORM（如 Prisma / Drizzle）或发起 HTTP 请求调用你的苹果CMS / TMDB / 豆瓣 API。
- 在 `src/modules/player/adapters/appleCmsAdapter.ts` 中已经内置了苹果CMS采集源的标准解析器，可直接将采集站的 `vod_play_url` 转化为多线路和集数播放列表。

### 2. 接入真实大模型 API (DeepSeek / 通义千问 / OpenAI / Claude)
在 `src/modules/ai-chat/services/aiService.ts` 中：
- 目前内置了高召回率的意图识别与语义匹配引擎；
- 扩展时只需在 `generateResponse` 中读取环境变量 `process.env.DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY`，将用户提问及片库摘要喂给模型，大模型输出结构化 JSON 卡片即可在聊天流中无缝渲染。

### 3. 开关或定制模块
在 `src/config/site.ts` 中：
```ts
export const siteConfig = {
  modules: {
    enableAiChat: true,       // 控制是否显示 AI 对话找片
    enableVisionSearch: true, // 控制是否开启以图识片
    enableHistory: true,      // 控制是否开启观看历史
    enableShortPlay: true,    // 控制是否开启微短剧专区
    enableMultiSource: true,  // 控制是否开启多线路解析切换
  }
};
```
修改开关后，界面导航与全局触发器将自动同步隐藏或启用。
