export type SupportedLocale = "zh-CN" | "en-US" | "ja-JP";

export interface LocaleDefinition {
  code: SupportedLocale;
  name: string;
  flag: string;
  shortName: string;
}

export const LOCALES: Record<SupportedLocale, LocaleDefinition> = {
  "zh-CN": {
    code: "zh-CN",
    name: "简体中文",
    flag: "🇨🇳",
    shortName: "中",
  },
  "en-US": {
    code: "en-US",
    name: "English",
    flag: "🇺🇸",
    shortName: "EN",
  },
  "ja-JP": {
    code: "ja-JP",
    name: "日本語",
    flag: "🇯🇵",
    shortName: "日",
  },
};

export const DEFAULT_LOCALE: SupportedLocale = "zh-CN";
export const LOCALE_COOKIE_NAME = "dianying_locale";
export const LOCALE_STORAGE_KEY = "dianying_locale";
