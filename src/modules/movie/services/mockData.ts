import { MovieItem } from "../types";

export const mockMovies: MovieItem[] = [
  {
    id: "m-101",
    title: "星际穿越",
    originalTitle: "Interstellar",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop",
    rating: 9.4,
    year: 2014,
    region: "欧美",
    genres: ["科幻", "冒险", "剧情"],
    director: "克里斯托弗·诺兰",
    actors: ["马修·麦康纳", "安妮·海瑟薇", "杰西卡·查斯坦"],
    summary: "在不远的未来，地球气候恶化导致粮食枯竭。前NASA宇航员库珀不得不告别年幼的女儿，加入一项穿越神秘虫洞的星际探索计划，为人类寻找新的生存家园。",
    category: "movie",
    updateStatus: "超清4K原声",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "硬核相对论物理与黑洞奇观的可视化极致呈现",
      "跨越维度与重力场的五维空间父女真挚情感",
      "汉斯·季默殿堂级风琴原声配乐极具压迫感与震撼"
    ],
    sources: [
      {
        id: "source-1",
        name: "蓝光专线 (推荐)",
        episodes: [
          { id: "ep-1", name: "超清4K正片", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      },
      {
        id: "source-2",
        name: "极速CDN",
        episodes: [
          { id: "ep-1", name: "1080P备用", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
        ]
      }
    ]
  },
  {
    id: "m-102",
    title: "盗梦空间",
    originalTitle: "Inception",
    poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    rating: 9.3,
    year: 2010,
    region: "欧美",
    genres: ["科幻", "悬疑", "动作"],
    director: "克里斯托弗·诺兰",
    actors: ["莱昂纳多·迪卡普里奥", "约瑟夫·高登-莱维特", "艾利奥特·佩吉"],
    summary: "柯布是一名经验老道的窃贼，擅长在受害人睡眠意识最脆弱时潜入其潜意识窃取机密。这一次，他接受了一项前所未有的任务：植入思想而非盗取。",
    category: "movie",
    updateStatus: "1080P国英双语",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "多层梦境嵌套与时间流速差异的惊天脑洞",
      "无重力走廊打斗长镜头实景拍摄震撼影史",
      "开放式陀螺结局引发十数年全民热烈讨论"
    ],
    sources: [
      {
        id: "source-1",
        name: "极速蓝光",
        episodes: [
          { id: "ep-1", name: "高清全片", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      }
    ]
  },
  {
    id: "m-103",
    title: "流浪地球2",
    originalTitle: "The Wandering Earth II",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop",
    rating: 8.3,
    year: 2023,
    region: "中国大陆",
    genres: ["科幻", "冒险", "灾难"],
    director: "郭帆",
    actors: ["吴京", "刘德华", "李雪健"],
    summary: "太阳危机即将来袭，人类面对灭顶之灾，试图启动行星发动机计划带着地球逃离太阳系。数字生命派与移山计划派展开多方博弈，人类命运悬于一线。",
    category: "movie",
    updateStatus: "超清4K独家",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "太空电梯长镜头与月球核聚变视觉奇观",
      "刘德华饰演图恒宇数字生命与父爱执念深刻动人",
      "中国重工业科幻电影工业化标杆之作"
    ],
    sources: [
      {
        id: "source-1",
        name: "4K原画线",
        episodes: [
          { id: "ep-1", name: "正片公映版", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      }
    ]
  },
  {
    id: "tv-201",
    title: "繁花",
    originalTitle: "Blossoms Shanghai",
    poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    rating: 8.7,
    year: 2023,
    region: "中国大陆",
    genres: ["剧情", "爱情", "年代"],
    director: "王家卫",
    actors: ["胡歌", "马伊琍", "唐嫣", "辛芷蕾"],
    summary: "九十年代的上海处处是机遇与希望。青年阿宝在爷叔的指点下脱颖而出成为叱咤黄河路的宝总，与玲子、汪小姐、李李展开数段情仇纠葛。",
    category: "tv",
    updateStatus: "全30集·沪语版",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "王家卫标志性单机位抽帧与浓烈光影美学",
      "90年代上海黄河路股市与外贸风云全景重现",
      "三位大女主性格鲜明，情感刻画细腻隐忍"
    ],
    sources: [
      {
        id: "source-1",
        name: "超清独播线",
        episodes: [
          { id: "ep-1", name: "第01集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
          { id: "ep-2", name: "第02集", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
          { id: "ep-3", name: "第03集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
          { id: "ep-4", name: "第04集", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ]
      }
    ]
  },
  {
    id: "tv-202",
    title: "狂飙",
    originalTitle: "The Knockout",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    rating: 8.5,
    year: 2023,
    region: "中国大陆",
    genres: ["剧情", "犯罪", "悬疑"],
    director: "徐纪周",
    actors: ["张译", "张颂文", "李一桐", "高叶"],
    summary: "京海市一线刑警安欣与鱼贩高启强长达二十年的黑白博弈与命运交错，折射扫黑除恶常态化斗争的艰苦历程。",
    category: "tv",
    updateStatus: "全39集完结",
    isHot: true,
    isFeatured: false,
    aiHighlights: [
      "高启强从小鱼贩到底层黑老大的心理转变细节拉满",
      "安欣跨越二十年不灭的正义初心执着感人"
    ],
    sources: [
      {
        id: "source-1",
        name: "VIP专线",
        episodes: [
          { id: "ep-1", name: "第01集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
          { id: "ep-2", name: "第02集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      }
    ]
  },
  {
    id: "sp-301",
    title: "无双战神归来",
    poster: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    rating: 8.9,
    year: 2024,
    region: "中国大陆",
    genres: ["战神", "逆袭", "热血"],
    summary: "镇守边疆五年荣归故里的北境战神，发现家人正遭受恶势力百般刁难。战神一怒，调遣十万将士平定四方！",
    category: "shortplay",
    updateStatus: "全80集完结",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "经典战神回归打脸爽文节奏，单集2分钟高能反转",
      "全网热度超5000万的年度爆款微短剧"
    ],
    sources: [
      {
        id: "source-1",
        name: "短剧秒播线",
        episodes: [
          { id: "ep-1", name: "第1集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
          { id: "ep-2", name: "第2集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
          { id: "ep-3", name: "第3集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
          { id: "ep-4", name: "第4集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      }
    ]
  },
  {
    id: "sp-302",
    title: "闪婚后顾总马甲藏不住了",
    poster: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    rating: 9.1,
    year: 2024,
    region: "中国大陆",
    genres: ["甜宠", "总裁", "爱情"],
    summary: "为了应付家族催婚，苏浅与咖啡厅萍水相逢的顾先生光速领证，却意外发现新婚老公竟是千亿跨国集团的神秘继承人！",
    category: "shortplay",
    updateStatus: "全95集完结",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "高甜先婚后爱，反套路甜宠喜剧设定",
      "女主聪明独立，双向奔赴甜蜜治愈"
    ],
    sources: [
      {
        id: "source-1",
        name: "极速短剧线",
        episodes: [
          { id: "ep-1", name: "第1集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
          { id: "ep-2", name: "第2集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      }
    ]
  },
  {
    id: "an-401",
    title: "鬼灭之刃：柱训练篇",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    rating: 9.2,
    year: 2024,
    region: "日本",
    genres: ["热血", "战斗", "奇幻"],
    summary: "炭治郎等人在刀匠村战役后休整，面对鬼舞辻无惨决战在即，鬼杀队开启全员魔鬼级柱间联合特训！",
    category: "anime",
    updateStatus: "全8集完结",
    isHot: true,
    isFeatured: false,
    aiHighlights: [
      "飞碟社殿堂级光影特效应接不暇",
      "决战前夕全员羁绊深化与日常温情"
    ],
    sources: [
      {
        id: "source-1",
        name: "日漫原生线",
        episodes: [
          { id: "ep-1", name: "第01集", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      }
    ]
  }
];
