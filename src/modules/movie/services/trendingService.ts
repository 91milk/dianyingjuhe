import { MovieItem } from "../types";

export const trendingMovies: MovieItem[] = [
  {
    id: "hot-101",
    title: "抓娃娃",
    originalTitle: "Successor",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
    rating: 7.3,
    year: 2024,
    region: "中国大陆",
    genres: ["喜剧", "剧情"],
    director: "闫非 / 彭大魔",
    actors: ["沈腾", "马丽", "史彭元", "萨日娜"],
    summary: "困苦家庭长大的马继业自幼便展现出惊人的懂事与刻苦，然而他并不知道，自己所经历的一切艰辛，都是千亿富豪父母为了淬炼他而精心策划的一场全天候沉浸式养成骗局...",
    category: "movie",
    updateStatus: "超清公映国语",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "西虹市宇宙沈腾马丽神仙合体，密集中式喜剧包袱",
      "荒诞沉浸式育儿实验引发现实教育深度共鸣",
      "豆瓣与猫眼双榜年度暑期档票房口碑双冠王"
    ],
    sources: [] // 异步多源探测填充
  },
  {
    id: "hot-102",
    title: "庆余年第二季",
    originalTitle: "Joy of Life Season 2",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    rating: 7.2,
    year: 2024,
    region: "中国大陆",
    genres: ["古装", "剧情", "武侠"],
    director: "孙皓",
    actors: ["张若昀", "李沁", "陈道明", "吴刚", "田雨"],
    summary: "该剧改编自猫腻同名畅销小说，讲述了身世神秘的少年范闲，历经家族、江湖、庙堂的种种考验与锤炼，书写出一段不同寻常又酣畅淋漓的人生传奇。",
    category: "tv",
    updateStatus: "全36集完结",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "张若昀携原班戏骨五年磨一剑回归重聚",
      "朝堂文武博弈与权谋反转剧情高潮迭起",
      "全网全平台断层领跑的热播剧王"
    ],
    sources: []
  },
  {
    id: "hot-103",
    title: "繁花",
    originalTitle: "Blossoms Shanghai",
    poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop",
    rating: 8.7,
    year: 2023,
    region: "中国大陆",
    genres: ["剧情", "爱情", "年代"],
    director: "王家卫",
    actors: ["胡歌", "马伊琍", "唐嫣", "辛芷蕾"],
    summary: "九十年代的上海处处是机遇与希望。青年阿宝在爷叔的指点下脱颖而出成为叱咤黄河路的宝总，与玲子、汪小姐、李李展开数段情仇纠葛。",
    category: "tv",
    updateStatus: "全30集·沪语/国语双版",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "王家卫标志性单机位抽帧与浓烈光影美学",
      "90年代上海黄河路股市与外贸风云全景重现",
      "三位大女主性格鲜明，情感刻画细腻隐忍"
    ],
    sources: []
  },
  {
    id: "hot-104",
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
    summary: "地球气候恶化导致粮食枯竭。前NASA宇航员库珀不得不告别年幼的女儿，加入一项穿越神秘虫洞的星际探索计划，为人类寻找新的生存家园。",
    category: "movie",
    updateStatus: "超清4K原画原声",
    isHot: true,
    isFeatured: true,
    aiHighlights: [
      "硬核相对论物理与黑洞奇观的可视化极致呈现",
      "跨越维度与重力场的五维空间父女真挚情感"
    ],
    sources: [
      {
        id: "source-default",
        name: "推荐极速源",
        episodes: [
          { id: "ep-1", name: "4K原画正片", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
        ]
      }
    ]
  },
  {
    id: "hot-105",
    title: "流浪地球2",
    originalTitle: "The Wandering Earth II",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    rating: 8.3,
    year: 2023,
    region: "中国大陆",
    genres: ["科幻", "冒险", "灾难"],
    director: "郭帆",
    actors: ["吴京", "刘德华", "李雪健"],
    summary: "太阳危机即将来袭，人类面对灭顶之灾，试图启动行星发动机计划带着地球逃离太阳系。数字生命派与移山计划派展开多方博弈。",
    category: "movie",
    updateStatus: "IMAX超高清",
    isHot: true,
    aiHighlights: [
      "太空电梯长镜头与月球核聚变视觉奇观",
      "中国科幻工业化标杆"
    ],
    sources: []
  },
  {
    id: "hot-106",
    title: "盗梦空间",
    originalTitle: "Inception",
    poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
    rating: 9.3,
    year: 2010,
    region: "欧美",
    genres: ["科幻", "悬疑", "动作"],
    director: "克里斯托弗·诺兰",
    actors: ["莱昂纳多·迪卡普里奥", "约瑟夫·高登-莱维特"],
    summary: "柯布是一名经验老道的窃贼，擅长在受害人睡眠意识最脆弱时潜入其潜意识窃取机密。这一次，他接受了一项前所未有的任务：植入思想而非盗取。",
    category: "movie",
    updateStatus: "1080P国英双语",
    isHot: true,
    aiHighlights: [
      "多层梦境嵌套与时间流速差异的惊天脑洞",
      "开放式陀螺结局引发热烈讨论"
    ],
    sources: []
  },
  {
    id: "sp-201",
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
      "经典战神打脸爽文节奏，单集2分钟高能反转",
      "热度超5000万的年度爆款短剧"
    ],
    sources: []
  },
  {
    id: "sp-202",
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
    aiHighlights: [
      "高甜先婚后爱，反套路甜宠喜剧设定",
      "女主聪明独立，双向奔赴"
    ],
    sources: []
  },
  {
    id: "sp-203",
    title: "真假千金之绝世凤华",
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    rating: 8.8,
    year: 2024,
    region: "中国大陆",
    genres: ["打脸", "逆袭", "豪门"],
    summary: "被偷换人生的真千金重返豪门，假千金百般算计，却不知真千金手握全球顶级神医与黑客身份！",
    category: "shortplay",
    updateStatus: "全78集完结",
    isHot: true,
    aiHighlights: ["爽文大女主，全场高能反杀打脸"],
    sources: []
  },
  {
    id: "an-301",
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
    aiHighlights: ["飞碟社殿堂级光影特效", "决战前夕全员羁绊深化"],
    sources: []
  },
  {
    id: "an-302",
    title: "进击的巨人 最终季",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    rating: 9.6,
    year: 2023,
    region: "日本",
    genres: ["热血", "悬疑", "奇幻"],
    summary: "艾伦·耶格尔启动地鸣，庞大超大型巨人踏平世界。调查兵团昔日同伴必须做出最终抉择。",
    category: "anime",
    updateStatus: "最终完结篇",
    isHot: true,
    aiHighlights: ["十一年史诗级巨作圆满收官", "自由意志与命运沉思"],
    sources: []
  }
];
