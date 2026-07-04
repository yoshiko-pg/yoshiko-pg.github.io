import type { RainLocale } from "./types";
import { ja } from "./ja";
import { en } from "./en";
import { ko } from "./ko";
import { zh } from "./zh";

export type { RainLocale } from "./types";

export type RainLang = "ja" | "en" | "ko" | "zh";

export const RAIN_LOCALES: Record<RainLang, RainLocale> = { ja, en, ko, zh };

const isRainLang = (v: string | null): v is RainLang =>
  v === "ja" || v === "en" || v === "ko" || v === "zh";

/** 表示言語を決める:?lang= があれば最優先、なければブラウザの言語設定から */
export function resolveRainLang(): RainLang {
  const q = new URLSearchParams(window.location.search).get("lang");
  if (isRainLang(q)) return q;
  for (const tag of navigator.languages ?? [navigator.language]) {
    const lang = tag.toLowerCase().split("-")[0];
    if (isRainLang(lang)) return lang;
  }
  return "en";
}
