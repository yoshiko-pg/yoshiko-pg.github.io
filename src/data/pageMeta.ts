import type { Talk } from "./talks";

export const SITE_ORIGIN = "https://yoshiko-pg.github.io";

export interface PageMeta {
  /** サイトルート相対パス(末尾スラッシュ付き) */
  path: string;
  title: string;
  description: string;
  /** サイトルート相対の画像パス */
  image: string;
  type: "website" | "article";
}

export const homePage: PageMeta = {
  path: "/",
  title: "yoshiko",
  description: "登壇資料置き場",
  image: "/og.png",
  type: "website",
};

export const rainPage: PageMeta = {
  path: "/apps/rain/",
  title: "RAIN.",
  description: "雨の日の窓ガラス。しずくをつれていくと、まちにあかりが灯る。",
  image: "/screenshots/rain.jpg",
  type: "website",
};

/** プリレンダー対象のミニアプリページ */
export const appPages: PageMeta[] = [rainPage];

export function talkPage(talk: Talk): PageMeta {
  return {
    path: `/talks/${talk.slug}/`,
    title: talk.title,
    description:
      talk.description ||
      `${talk.date.replace(/-/g, "/")}の${talk.event}での発表「${talk.title}」のスライドです。`,
    image: talk.thumbnail ?? homePage.image,
    type: "article",
  };
}
