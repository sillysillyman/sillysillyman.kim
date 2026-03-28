// 사이트 설정 — fork 후 이 파일만 수정하면 됩니다.
export const config = {
  // 사이트 기본 정보
  name: 'sillysillyman.kim',
  description: 'Backend · Infra · Algorithm — 문제를 정의하고, 해결하고, 기록합니다.',
  url: process.env.SITE_URL!, // .env.local에 SITE_URL 필수
  locale: 'ko_KR',
  language: 'ko',

  // SEO 키워드
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

  // 작성자 정보
  author: {
    name: 'sillysillyman',
    title: 'Backend Developer',
    bio: 'Kotlin/Spring Boot, Node.js, AWS 기반 백엔드 개발을 하고 있습니다.',
    email: 'sillysillyman.cs@gmail.com',
    github: 'https://github.com/sillysillyman',
    // linkedin: 'https://linkedin.com/in/yourname',
  },

  // Giscus 댓글 설정 (https://giscus.app 에서 발급, 미설정 시 댓글 비활성화)
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || '',
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '',
    category: 'Announcements',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '',
  },

  // Google Search Console 인증 코드 (없으면 빈 문자열)
  verification: {
    google: 'mui2IqJrOIG56hgmu2TzMXJsuf7J7ASfMVs-mjivtYk',
  },
};
