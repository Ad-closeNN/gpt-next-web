import cn from "./cn";
import gta from "./tw"; // 是港台澳的意思，不要理解错了()
import sorry from "./cn"; // 报错提示，默认中文

import { merge } from "../utils/merge";
import { safeLocalStorage } from "@/app/utils";

import type { LocaleType } from "./cn";
export type { LocaleType, PartialLocaleType } from "./cn";

const localStorage = safeLocalStorage();

const ALL_LANGS = {
  cn,
  gta,
  sorry,
};

export type Lang = keyof typeof ALL_LANGS;

export const AllLangs = Object.keys(ALL_LANGS) as Lang[];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  cn: "简体中文 / Simplified Chinese",
  gta: "繁體中文 / Traditional Chinese", // 是港台澳的意思，不要理解错了()
  sorry: "Sorry, English and other languages are not available.", // 是港台澳的意思，不要理解错了()
};

const LANG_KEY = "lang";
const DEFAULT_LANG: Lang = "cn";

const fallbackLang = cn;
const targetLang = ALL_LANGS[getLang()] as LocaleType;

// if target lang missing some fields, it will use fallback lang string
merge(fallbackLang, targetLang);

export default fallbackLang as LocaleType;

function getItem(key: string) {
  return localStorage.getItem(key);
}

function setItem(key: string, value: string) {
  localStorage.setItem(key, value);
}

function getLanguage() {
  try {
    const locale = new Intl.Locale(navigator.language).maximize();
    const region = locale?.region?.toLowerCase();
    // 1. check region code in ALL_LANGS
    if (AllLangs.includes(region as Lang)) {
      return region as Lang;
    }
    // 2. check language code in ALL_LANGS
    if (AllLangs.includes(locale.language as Lang)) {
      return locale.language as Lang;
    }
    return DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function getLang(): Lang {
  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  return getLanguage() as Lang;
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}

export function getISOLang() {
  const isoLangString: Record<string, string> = {
    cn: "zh-Hans",
    gta: "zh-Hant", // 是港台澳的意思，不要理解错了()
    sorry: "zh-Hans",
  };

  const lang = getLang();
  return isoLangString[lang] ?? lang;
}

const DEFAULT_STT_LANG = "zh-CN";
export const STT_LANG_MAP: Record<Lang, string> = {
  cn: "zh-CN",
  gta: "zh-TW", // 是港台澳的意思，不要理解错了()
  sorry: "zh-CN", // 抱歉提示
};

export function getSTTLang(): string {
  try {
    return STT_LANG_MAP[getLang()];
  } catch {
    return DEFAULT_STT_LANG;
  }
}