// Site configuration — edit this file after forking.
export const config = {
  // Basic site info
  name: 'sillysillyman.kim',
  description: 'Backend · Infra · Algorithm — 문제를 정의하고, 해결하고, 기록합니다.',
  url: process.env.SITE_URL!, // SITE_URL required in .env.local
  locale: 'ko_KR',
  language: 'ko',

  // SEO keywords
  keywords: [
    '개발 블로그',
    'Backend',
    'Spring Boot',
    'Node.js',
    'AWS',
    'Kotlin',
    'TypeScript',
    '트러블슈팅',
    '인프라',
  ],

  // Author info
  author: {
    name: 'sillysillyman',
    title: 'Backend Developer',
    bio: 'Kotlin/Spring Boot, Node.js, AWS 기반 백엔드 개발을 하고 있습니다.',
    email: 'sillysillyman.cs@gmail.com',
    github: 'https://github.com/sillysillyman',
    // linkedin: 'https://linkedin.com/in/yourname',
  },

  // Giscus comments (get keys from https://giscus.app, comments disabled if unset)
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '',
    category: 'Announcements',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
  },

  // Read time calculation (500 for CJK languages, 200~250 for English)
  charsPerMinute: 500,

  // Google Search Console verification code (empty string if none)
  verification: {
    google: 'mui2IqJrOIG56hgmu2TzMXJsuf7J7ASfMVs-mjivtYk',
  },
};
