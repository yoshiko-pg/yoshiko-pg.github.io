import { useEffect } from "react";

// /apps/* のミニアプリをサブパススコープのPWAとしてインストール可能にするフック。
// 対象ページを開いている間だけマニフェスト等をheadへ追加し、離れたら取り除く。
// appPath 配下に manifest.webmanifest と icon-192.png を置いておくこと。
export function usePwaManifest(appPath: string) {
  useEffect(() => {
    const base = appPath.endsWith("/") ? appPath : `${appPath}/`;
    const tags: [tag: string, attrs: Record<string, string>][] = [
      ["link", { rel: "manifest", href: `${base}manifest.webmanifest` }],
      ["link", { rel: "apple-touch-icon", href: `${base}icon-192.png` }],
      ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
      [
        "meta",
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
      ],
    ];
    const elements = tags.map(([tag, attrs]) => {
      const el = document.createElement(tag);
      for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
      document.head.appendChild(el);
      return el;
    });
    // インストールバナーは勝手に出さない(ブラウザのメニューからはインストールできる)
    const suppressBanner = (e: Event) => e.preventDefault();
    window.addEventListener("beforeinstallprompt", suppressBanner);
    return () => {
      elements.forEach((el) => el.remove());
      window.removeEventListener("beforeinstallprompt", suppressBanner);
    };
  }, [appPath]);
}
