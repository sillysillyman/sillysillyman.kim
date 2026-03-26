import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Post } from './types';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 디버깅: Notion 클라이언트 확인
console.log('Notion client initialized:', {
  hasClient: !!notion,
  hasDatabases: !!notion.databases,
  hasQuery: !!(notion.databases && typeof notion.databases.query === 'function'),
  apiKey: process.env.NOTION_API_KEY ? 'Set' : 'Missing',
  databaseId: process.env.NOTION_DATABASE_ID ? 'Set' : 'Missing',
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// 볼드/이탤릭 + 코드 조합 시 HTML 태그로 출력 (마크다운 파서 호환성 문제 해결)
n2m.annotatePlainText = (text: string, annotations: any) => {
  if (text.match(/^\s*$/)) return text;

  const leadingSpace = text.match(/^(\s*)/)?.[0] || '';
  const trailingSpace = text.match(/(\s*)$/)?.[0] || '';
  text = text.trim();

  if (!text) return leadingSpace + trailingSpace;

  // 코드 + 볼드/이탤릭 조합: HTML 태그 사용
  if (annotations.code && (annotations.bold || annotations.italic)) {
    let result = `<code>${text}</code>`;
    if (annotations.bold) result = `<strong>${result}</strong>`;
    if (annotations.italic) result = `<em>${result}</em>`;
    if (annotations.strikethrough) result = `<del>${result}</del>`;
    if (annotations.underline) result = `<u>${result}</u>`;
    return leadingSpace + result + trailingSpace;
  }

  // 일반 처리
  if (annotations.code) text = `\`${text}\``;
  if (annotations.bold) text = `**${text}**`;
  if (annotations.italic) text = `_${text}_`;
  if (annotations.strikethrough) text = `~~${text}~~`;
  if (annotations.underline) text = `<u>${text}</u>`;

  return leadingSpace + text + trailingSpace;
};

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// 로컬 개발 환경에서는 Draft 글도 표시
const isDev = process.env.NODE_ENV === 'development';

// Status 필터: 개발 환경에서는 Draft + Published, 프로덕션에서는 Published만
function getStatusFilter(): any {
  if (isDev) {
    return {
      or: [
        { property: 'Status', select: { equals: 'Published' } },
        { property: 'Status', select: { equals: 'Draft' } },
      ],
    };
  }
  return { property: 'Status', select: { equals: 'Published' } };
}

// Notion 속성 값 추출 헬퍼 함수들
function getTitle(property: any): string {
  if (!property || !property.title) return '';
  return property.title.map((t: any) => t.plain_text).join('');
}

function getRichText(property: any): string {
  if (!property || !property.rich_text) return '';
  return property.rich_text.map((t: any) => {
    // Notion equation 블록은 $로 감싸서 LaTeX 렌더링 가능하게 함
    if (t.type === 'equation') return `$${t.plain_text}$`;
    return t.plain_text;
  }).join('');
}

function getSelect(property: any): string {
  if (!property) return '';
  return property.select?.name || '';
}

function getDate(property: any): string {
  if (!property) return '';
  return property.date?.start || '';
}

function getNumber(property: any): number | undefined {
  if (!property) return undefined;
  return property.number ?? undefined;
}

function getCheckbox(property: any): boolean {
  if (!property) return false;
  return property.checkbox || false;
}

function getUrl(property: any): string | undefined {
  if (!property) return undefined;
  return property.url || undefined;
}

function getFiles(property: any): string | undefined {
  if (!property || !property.files?.[0]) return undefined;
  return property.files[0].file?.url || property.files[0].external?.url;
}

// Notion 페이지를 Post 객체로 변환
function notionPageToPost(page: any): Post {
  const props = page.properties;

  return {
    id: page.id,
    title: getTitle(props.Title),
    slug: getRichText(props.Slug),
    description: getRichText(props.Description),
    status: getSelect(props.Status) as 'Draft' | 'Published' | 'Archived',
    publishedAt: getDate(props.PublishedAt),
    tag: getSelect(props.Tag),
    series: getSelect(props.Series) || undefined,
    seriesOrder: getNumber(props.SeriesOrder),
    pinned: getCheckbox(props.Pinned),
    thumbnail: getFiles(props.ThumbnailUrl),
    canonicalUrl: getUrl(props.CanonicalURL),
  };
}

// 모든 Published 글 가져오기
export async function getAllPosts(): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: getStatusFilter(),
    sorts: [
      {
        property: 'Pinned',
        direction: 'descending',
      },
      {
        property: 'PublishedAt',
        direction: 'descending',
      },
    ],
  });

  const posts = response.results.map(notionPageToPost);

  // ReadTime 계산 추가
  return posts.map((post) => ({
    ...post,
    readTime: calculateReadTime(post.description),
  }));
}

// Slug로 특정 글 가져오기
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
        getStatusFilter(),
      ],
    },
  });

  if (response.results.length === 0) {
    return null;
  }

  const post = notionPageToPost(response.results[0]);

  // 실제 본문 내용을 가져와서 정확한 읽기 시간 계산
  const content = await getPostContent(post.id);
  const readTime = calculateReadTime(content);

  return {
    ...post,
    readTime,
  };
}

// 태그별 글 가져오기
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Tag',
          select: {
            equals: tag,
          },
        },
        getStatusFilter(),
      ],
    },
    sorts: [
      {
        property: 'PublishedAt',
        direction: 'descending',
      },
    ],
  });

  const posts = response.results.map(notionPageToPost);

  return posts.map((post) => ({
    ...post,
    readTime: calculateReadTime(post.description),
  }));
}

// 시리즈별 글 가져오기
export async function getPostsBySeries(series: string): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Series',
          select: {
            equals: series,
          },
        },
        getStatusFilter(),
      ],
    },
    sorts: [
      {
        property: 'SeriesOrder',
        direction: 'ascending',
      },
    ],
  });

  const posts = response.results.map(notionPageToPost);

  return posts.map((post) => ({
    ...post,
    readTime: calculateReadTime(post.description),
  }));
}

// 모든 태그 가져오기
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = [...new Set(posts.map((post) => post.tag))];
  return tags.filter(Boolean);
}

// 모든 시리즈 가져오기
export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts();
  const series = [...new Set(posts.map((post) => post.series).filter(Boolean))];
  return series as string[];
}

// 글 본문 내용을 마크다운으로 가져오기
export async function getPostContent(pageId: string): Promise<string> {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    return mdString.parent || '';
  } catch (error) {
    console.error('Failed to get post content:', error);
    return '';
  }
}

// 읽기 시간 계산 (한국어: 분당 500자 기준)
export function calculateReadTime(text?: string): number {
  if (!text) return 1;
  const charCount = text.replace(/\s/g, '').length;
  const readTime = Math.ceil(charCount / 500);
  return Math.max(1, readTime); // 최소 1분
}
