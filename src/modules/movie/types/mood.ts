export type MoodType =
  | "weekend"
  | "dinner"
  | "mindbend"
  | "adrenaline"
  | "healing"
  | "thriller";

export interface MoodMeta {
  id: MoodType;
  title: string;
  icon: string;
  tagline: string;
  aiQuote: string;
  accentColor: string;
  badge: string;
}

export const MOOD_DEFINITIONS: MoodMeta[] = [
  {
    id: "weekend",
    title: "周末大片",
    icon: "🍿",
    tagline: "巨幕视效震撼 · 豆瓣高分与科幻奇幻殿堂",
    aiQuote: "为您精选适合关灯沉浸观赏的视听史诗，世界观宏大、视效拉满",
    accentColor: "from-amber-500 to-yellow-400",
    badge: "视效盛宴",
  },
  {
    id: "dinner",
    title: "下饭必备",
    icon: "🍜",
    tagline: "笑点密集 · 轻松解压 · 吃饭倍香的国民好剧",
    aiQuote: "无需费脑的高分喜剧与温馨群像，每一集都是纯粹快乐",
    accentColor: "from-orange-500 to-amber-400",
    badge: "爆笑解压",
  },
  {
    id: "mindbend",
    title: "烧脑反转",
    icon: "🤯",
    tagline: "高能反转 · 硬核推理 · 不到最后一秒猜不到真相",
    aiQuote: "多重叙事诡计与细节伏笔，每一分钟都在挑战你的直觉与判断",
    accentColor: "from-purple-500 to-indigo-400",
    badge: "反转封神",
  },
  {
    id: "adrenaline",
    title: "爽感逆袭",
    icon: "⚡",
    tagline: "极速快节奏 · 战神打脸 · 极致爽快的逆袭快车道",
    aiQuote: "节奏极快绝不拖泥带水，全集高能反击，专治憋屈与心累",
    accentColor: "from-rose-500 to-amber-500",
    badge: "短剧快车",
  },
  {
    id: "healing",
    title: "治愈温情",
    icon: "😭",
    tagline: "泪腺失守 · 温暖心事 · 慢下来细细品味的温情佳作",
    aiQuote: "细腻真实的人间烟火与成长羁绊，静静抚平生活里的疲惫",
    accentColor: "from-teal-500 to-emerald-400",
    badge: "暖心破防",
  },
  {
    id: "thriller",
    title: "惊悚心跳",
    icon: "👻",
    tagline: "心跳加速 · 极致压迫感 · 肾上腺素飙升的高能尖叫",
    aiQuote: "怪兽末日、窒息氛围与紧凑心跳，适合拉上朋友一起尖叫",
    accentColor: "from-red-500 to-rose-600",
    badge: "高能刺激",
  },
];
