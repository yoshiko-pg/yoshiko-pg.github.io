export interface App {
  slug: string;
  title: string;
  description: string;
  url: string;
  external: boolean;
  thumbnail: string;
}

export const apps: App[] = [
  {
    slug: "rain",
    title: "Rain",
    description: "窓辺に雨がふる",
    url: "/apps/rain/",
    external: false,
    thumbnail: "/screenshots/rain.jpg",
  },
  {
    slug: "difit",
    title: "difit",
    description: "ローカルGit diffビューア",
    url: "https://yoshiko-pg.github.io/difit/",
    external: true,
    thumbnail: "/screenshots/difit.jpg",
  },
];
