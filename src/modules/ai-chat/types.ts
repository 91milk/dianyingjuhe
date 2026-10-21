import { MovieItem } from "@/modules/movie/types";

export type MessageRole = "user" | "assistant" | "system";

export interface MovieRecommendation {
  movie: MovieItem;
  recommendReason: string; // AI推荐理由，如“层层嵌套的四层梦境脑洞，反转绝伦”
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  recommendations?: MovieRecommendation[];
  createdAt: number;
}

export interface AiPromptPreset {
  label: string;
  prompt: string;
  icon?: string;
}
