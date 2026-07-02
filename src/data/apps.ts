export interface App {
  slug: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export const apps: App[] = [
  {
    slug: "rain",
    title: "Rain",
    description: "窓辺に雨がふる",
    url: "/apps/rain/",
    thumbnail: "/screenshots/rain.jpg",
  },
  {
    slug: "difit",
    title: "difit",
    description: "ローカルGit diffビューア",
    url: "https://yoshiko-pg.github.io/difit/",
    thumbnail: "/screenshots/difit.jpg",
  },
];
