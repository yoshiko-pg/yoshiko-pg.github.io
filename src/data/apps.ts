export interface App {
  slug: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export const apps: App[] = [
  {
    slug: "difit",
    title: "difit",
    description: "ローカルGit diffビューア",
    url: "https://yoshiko-pg.github.io/difit/",
    thumbnail: "https://yoshiko-pg.github.io/difit/site-data/og-image.png",
  },
  {
    slug: "ponkan",
    title: "PONKAN",
    description: "ミュージアムのマップとスタンプラリー",
    url: "https://yoshiko-pg.github.io/ponkan/",
    thumbnail: "https://yoshiko-pg.github.io/ponkan/og-image.jpg",
  },
  {
    slug: "rain",
    title: "Rain",
    description: "窓辺に雨がふる",
    url: "/apps/rain/",
    thumbnail: "/screenshots/rain.jpg",
  },
];
