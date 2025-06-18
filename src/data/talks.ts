export interface Talk {
  slug: string;
  title: string;
  event: string;
  date: string;
  description: string;
  thumbnail?: string;
  pdfPath: string;
}

export const talks: Talk[] = [
  {
    slug: 'norents-2025',
    title: '全コードレビューコメントをAIに分析させて学びを得てみる',
    event: 'norents',
    date: '2025-06-13',
    description: '',
    thumbnail: '/thumbnails/norents.png',
    pdfPath: '/slides/norents.pdf'
  },
  {
    slug: 'ui-mcp-2025',
    title: 'catから始めるUI MCP',
    event: 'THE UI EXPERTS - AI×MCPの可能性',
    date: '2025-05-12',
    description: '',
    thumbnail: '/thumbnails/20250512-ui-mcp.png',
    pdfPath: '/slides/20250512-ui-mcp.pdf'
  },
  {
    slug: 'tech-front-meetup-2024',
    title: '4年間でのフロントエンド リアーキテクチャの変遷と進め方',
    event: 'Tech.Front Meetup',
    date: '2024-12-12',
    description: '',
    thumbnail: '/thumbnails/4年間でのフロントエンド リアーキテクチャの変遷と進め方.png',
    pdfPath: '/slides/4年間でのフロントエンド リアーキテクチャの変遷と進め方.pdf'
  },
  {
    slug: 'web-frontend-study-2024',
    title: 'コンパウンド戦略を支えるフロントエンド基盤設計',
    event: 'Webフロントエンド勉強会',
    date: '2024-11-08',
    description: '',
    thumbnail: '/thumbnails/コンパウンド戦略を支えるフロントエンド基盤設計.png',
    pdfPath: '/slides/コンパウンド戦略を支えるフロントエンド基盤設計.pdf'
  },
  {
    slug: 'frontend-conf-hokkaido-2024',
    title: '腐敗防止層によるスムーズなライブラリ移行',
    event: 'フロントエンドカンファレンス北海道',
    date: '2024-08-24',
    description: '',
    thumbnail: '/thumbnails/腐敗防止層によるスムーズなライブラリ移行.png',
    pdfPath: '/slides/腐敗防止層によるスムーズなライブラリ移行.pdf'
  },
  {
    slug: 'encraft-12-2024',
    title: 'DOMクイズ！',
    event: 'Encraft #12',
    date: '2024-03-28',
    description: '',
    thumbnail: '/thumbnails/Encraft #12 DOMクイズ！ のコピー.png',
    pdfPath: '/slides/Encraft #12 DOMクイズ！ のコピー.pdf'
  },
  {
    slug: 'encraft-6-2023',
    title: 'ButtonとLink、どう実装する？',
    event: 'Encraft #6',
    date: '2023-08-30',
    description: '',
    thumbnail: '/thumbnails/ButtonとLink、どう実装する？ のコピー.png',
    pdfPath: '/slides/ButtonとLink、どう実装する？ のコピー.pdf'
  },
  {
    slug: 'encraft-4-2023',
    title: 'Suspense Fetchを3年実用してみて',
    event: 'Encraft #4',
    date: '2023-06-29',
    description: '',
    thumbnail: '/thumbnails/Suspense Fetchを3年実用してみて - Encraft#4 のコピー.png',
    pdfPath: '/slides/Suspense Fetchを3年実用してみて - Encraft#4 のコピー.pdf'
  },
  {
    slug: 'harajuku-js-2023',
    title: 'ナレッジワークでの State管理とRecoil活用事例',
    event: 'Harajuku.js Meetup',
    date: '2023-01-20',
    description: '',
    thumbnail: '/thumbnails/20230120-Recoil勉強会 のコピー.png',
    pdfPath: '/slides/20230120-Recoil勉強会 のコピー.pdf'
  },
  {
    slug: 'devfest-2022',
    title: 'Web Standard: 今まであった重いたプレ、これからこうう重けそう',
    event: 'DevFest 2022',
    date: '2022-12-16',
    description: '',
    thumbnail: '/thumbnails/20221216_DevFest 2022 Web Session.png',
    pdfPath: '/slides/20221216_DevFest 2022 Web Session.pdf'
  },
  {
    slug: 'devfest-2021',
    title: 'DevFest Tokyo 2021 Web Session',
    event: 'DevFest Tokyo 2021',
    date: '2021-12-11',
    description: '',
    thumbnail: '/thumbnails/20211211_DevFest 2021 Web Session.png',
    pdfPath: '/slides/20211211_DevFest 2021 Web Session.pdf'
  },
  {
    slug: 'sample-talk-1',
    title: 'Welcome to Slidev',
    event: 'Sample Presentation',
    date: '2024-01-01',
    description: '',
    thumbnail: '/thumbnails/sample-talk-1.png',
    pdfPath: '/slides/sample-talk-1.pdf'
  }
];