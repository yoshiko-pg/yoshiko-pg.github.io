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
    thumbnail: '/thumbnails/20250613_norents.png',
    pdfPath: '/slides/20250613_norents.pdf'
  },
  {
    slug: 'ui-mcp-2025',
    title: 'catから始めるUI MCP',
    event: 'THE UI EXPERTS - AI×MCPの可能性',
    date: '2025-05-12',
    description: '',
    thumbnail: '/thumbnails/20250512_UIExperts.png',
    pdfPath: '/slides/20250512_UIExperts.pdf'
  },
  {
    slug: 'tech-front-meetup-2024',
    title: '4年間でのフロントエンド リアーキテクチャの変遷と進め方',
    event: 'Tech-Front Meetup',
    date: '2024-12-12',
    description: '',
    thumbnail: '/thumbnails/20241212_TechFrontMeetup.png',
    pdfPath: '/slides/20241212_TechFrontMeetup.pdf'
  },
  {
    slug: 'web-frontend-study-2024',
    title: 'コンパウンド戦略を支えるフロントエンド基盤設計',
    event: 'Webフロントエンド勉強会',
    date: '2024-11-08',
    description: '',
    thumbnail: '/thumbnails/20241108_WebFrontendStudy.png',
    pdfPath: '/slides/20241108_WebFrontendStudy.pdf'
  },
  {
    slug: 'frontend-conf-hokkaido-2024',
    title: '腐敗防止層によるスムーズなライブラリ移行',
    event: 'フロントエンドカンファレンス北海道',
    date: '2024-08-24',
    description: '',
    thumbnail: '/thumbnails/20240824_FrontendConfHokkaido.png',
    pdfPath: '/slides/20240824_FrontendConfHokkaido.pdf'
  },
  {
    slug: 'encraft-12-2024',
    title: 'DOMクイズ！',
    event: 'Encraft #12',
    date: '2024-03-28',
    description: '',
    thumbnail: '/thumbnails/20240328_Encraft12.png',
    pdfPath: '/slides/20240328_Encraft12.pdf'
  },
  {
    slug: 'encraft-6-2023',
    title: 'ButtonとLink、どう実装する？',
    event: 'Encraft #6',
    date: '2023-08-30',
    description: '',
    thumbnail: '/thumbnails/20230830_Encraft6.png',
    pdfPath: '/slides/20230830_Encraft6.pdf'
  },
  {
    slug: 'encraft-4-2023',
    title: 'Suspense Fetchを3年実用してみて',
    event: 'Encraft #4',
    date: '2023-06-29',
    description: '',
    thumbnail: '/thumbnails/20230629_Encraft4.png',
    pdfPath: '/slides/20230629_Encraft4.pdf'
  },
  {
    slug: 'harajuku-js-2023',
    title: 'ナレッジワークでの State管理とRecoil活用事例',
    event: 'Harajuku.js Meetup',
    date: '2023-01-20',
    description: '',
    thumbnail: '/thumbnails/20230120_HarajukuJsMeetup.png',
    pdfPath: '/slides/20230120_HarajukuJsMeetup.pdf'
  },
  {
    slug: 'devfest-2022',
    title: 'Web Standard: 今まであった重いたプレ、これからこうう重けそう',
    event: 'DevFest 2022',
    date: '2022-12-16',
    description: '',
    thumbnail: '/thumbnails/20221216_DevFest2022.png',
    pdfPath: '/slides/20221216_DevFest2022.pdf'
  },
  {
    slug: 'devfest-2021',
    title: 'DevFest Tokyo 2021 Web Session',
    event: 'DevFest Tokyo 2021',
    date: '2021-12-11',
    description: '',
    thumbnail: '/thumbnails/20211211_DevFest2021.png',
    pdfPath: '/slides/20211211_DevFest2021.pdf'
  },
];