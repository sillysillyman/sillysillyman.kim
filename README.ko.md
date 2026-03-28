# sillysillyman.kim

[![GitHub stars](https://img.shields.io/github/stars/sillysillyman/sillysillyman.kim?style=social)](https://github.com/sillysillyman/sillysillyman.kim/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sillysillyman/sillysillyman.kim?style=social)](https://github.com/sillysillyman/sillysillyman.kim/fork)

Notion 기반 개발 블로그. Fork 후 config 파일 하나만 수정하면 바로 배포할 수 있습니다.

**데모**: [sillysillyman.kim](https://sillysillyman.kim)

| 라이트 모드 | 다크 모드 |
|-------------|-----------|
| ![라이트 모드](public/screenshots/light.png) | ![다크 모드](public/screenshots/dark.png) |

## 기능

- **Notion CMS** — Notion에서 글 작성, API로 자동 조회
- **ISR** — Incremental Static Regeneration (60초 간격)
- **다크모드** — 시스템 설정 연동 + 수동 토글
- **검색 & 필터** — 제목/설명/태그 실시간 검색, 태그/시리즈 필터링
- **무한 스크롤** — IntersectionObserver 기반
- **마크다운** — 코드 하이라이팅, KaTeX 수식, Mermaid 다이어그램
- **SEO** — 동적 메타데이터, Open Graph, sitemap, robots.txt, RSS
- **댓글** — Giscus (GitHub Discussions 기반, 선택)
- **반응형** — 모바일 1열 ~ 데스크톱 4열 카드 그리드

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v3
- Notion API
- Vercel

## 시작하기

### 1. Fork & Install

이 리포지토리 우측 상단의 **Fork** 버튼을 클릭한 후, fork된 리포지토리를 clone하세요:

```bash
git clone https://github.com/<your-username>/<forked-repo>.git
cd <forked-repo>
npm install
```

### 2. Notion 데이터베이스 생성

아래 속성으로 Notion 데이터베이스를 생성하세요:

![Notion Database](public/screenshots/notion-database.png)

| 속성명       | Notion 타입   | 설명                            |
| ------------ | ------------- | ------------------------------- |
| Title        | 제목(Title)   | 글 제목                         |
| Slug         | 텍스트        | URL 경로 (영문 소문자 + 하이픈) |
| Description  | 텍스트        | SEO 요약                        |
| Status       | 선택          | `Published` (공개), `Draft` (로컬만), `Archived` (숨김) |
| PublishedAt  | 날짜          | 공개일                          |
| Tag          | 선택          | 태그 (아래 목록 참고)           |
| Series       | 선택          | 시리즈 (선택)                   |
| SeriesOrder  | 숫자          | 시리즈 내 순서 (선택)           |
| Pinned       | 체크박스      | 상단 고정 (선택)                |
| ThumbnailUrl | 파일과 미디어 | 커버 이미지 (선택)              |
| CanonicalURL | URL           | 원본 URL, SEO용 (선택)          |

그다음 [Notion Integration](https://www.notion.so/profile/integrations)을 생성하고 데이터베이스에 연결하세요 (데이터베이스 페이지 `···` → `연결` → Integration 추가).

### 3. 사이트 설정

`lib/config.ts`를 본인 정보로 수정하세요:

```ts
export const config = {
  name: '내 블로그',
  description: '블로그 한 줄 소개',
  locale: 'ko_KR',
  language: 'ko',
  keywords: ['블로그', '개발', ...],

  author: {
    name: '이름',
    title: '직함',
    bio: '간단한 자기소개',
    email: 'you@example.com',
    github: 'https://github.com/yourusername',
  },

  charsPerMinute: 500, // CJK 500, 영어 200~250

  verification: {
    google: '', // Google Search Console 인증 코드 (선택)
  },
};
```

### 4. 환경변수 설정

`.env.example`을 `.env.local`로 복사하세요:

```bash
cp .env.example .env.local
```

Database ID를 찾으려면 Notion에서 데이터베이스를 전체 페이지로 열고 브라우저 주소창을 확인하세요:

```
https://www.notion.so/<DATABASE_ID>?v=<VIEW_ID>
                      ^^^^^^^^^^^^^^^^
                      이 32자 문자열이 Database ID
```

```env
# 필수
NOTION_API_KEY=secret_xxx        # Notion Integration에서 발급
NOTION_DATABASE_ID=xxx           # 위 URL에서 추출한 32자 ID
SITE_URL=https://yourdomain.com  # 배포 도메인

# 선택 — Giscus 댓글 (미설정 시 댓글 비활성화)
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxx
```

Giscus 값은 [giscus.app](https://giscus.app)에서 발급받으세요.

### 5. 로컬 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인.

### 6. Vercel 배포

1. [Vercel](https://vercel.com) → **Add New Project** → fork한 레포 import
2. `.env.local`과 동일한 환경변수 추가
3. **Deploy**

커스텀 도메인은 Vercel 프로젝트 Settings > Domains에서 설정.

## 커스터마이징

### 태그

`lib/constants.ts`의 `TAG_MAP`을 수정하세요. Notion 데이터베이스의 Tag 선택 옵션도 함께 업데이트해야 합니다.

```ts
export const TAG_MAP: Record<string, TagInfo> = {
  // Notion에 저장되는 영문 키 → 화면에 표시되는 라벨 + 색상
  troubleshooting: {
    id: 'troubleshooting',
    label: '트러블슈팅',
    emoji: '🔥',
    color: { from: '#ef4444', to: '#dc2626' },
  },
  // 태그 추가...
};
```

### 시리즈

`lib/constants.ts`의 `SERIES_MAP`을 수정하세요. Notion 데이터베이스의 Series 선택 옵션도 함께 업데이트해야 합니다.

```ts
export const SERIES_MAP: Record<string, SeriesInfo> = {
  'my-series': {
    id: 'my-series',
    label: '내 시리즈',
    emoji: '📚',
  },
};
```

## 프로젝트 구조

```
lib/config.ts          # 사이트 설정 (fork 후 수정)
lib/constants.ts       # 태그/시리즈 정의
lib/notion.ts          # Notion API 클라이언트
app/
├── layout.tsx         # 루트 레이아웃
├── page.tsx           # 메인 페이지
├── posts/[slug]/      # 글 상세 페이지
├── api/posts/         # Posts API (ISR 60초)
├── feed.xml/          # RSS 피드
├── sitemap.ts         # 동적 사이트맵
└── robots.ts          # robots.txt
components/            # UI 컴포넌트
```

## 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## 업데이트 반영

원본 템플릿의 업데이트를 반영하려면:

```bash
git remote add upstream https://github.com/sillysillyman/sillysillyman.kim.git
git fetch upstream
git merge upstream/main
```

## 라이선스

[MIT](LICENSE)
