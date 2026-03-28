import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { Post } from './types';
import { config } from './config';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Debug: verify Notion client
console.log('Notion client initialized:', {
  hasClient: !!notion,
  hasDatabases: !!notion.databases,
  hasQuery: !!(notion.databases && typeof notion.databases.query === 'function'),
  apiKey: process.env.NOTION_API_KEY ? 'Set' : 'Missing',
  databaseId: process.env.NOTION_DATABASE_ID ? 'Set' : 'Missing',
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Output HTML tags for bold/italic + code combos (fixes markdown parser compatibility)
n2m.annotatePlainText = (text: string, annotations: any) => {
  if (text.match(/^\s*$/)) return text;

  const leadingSpace = text.match(/^(\s*)/)?.[0] || '';
  const trailingSpace = text.match(/(\s*)$/)?.[0] || '';
  text = text.trim();

  if (!text) return leadingSpace + trailingSpace;

  // Code + bold/italic combo: use HTML tags
  if (annotations.code && (annotations.bold || annotations.italic)) {
    let result = `<code>${text}</code>`;
    if (annotations.bold) result = `<strong>${result}</strong>`;
    if (annotations.italic) result = `<em>${result}</em>`;
    if (annotations.strikethrough) result = `<del>${result}</del>`;
    if (annotations.underline) result = `<u>${result}</u>`;
    return leadingSpace + result + trailingSpace;
  }

  // Default handling
  if (annotations.code) text = `\`${text}\``;
  if (annotations.bold) text = `<strong>${text}</strong>`;
  if (annotations.italic) text = `<em>${text}</em>`;
  if (annotations.strikethrough) text = `~~${text}~~`;
  if (annotations.underline) text = `<u>${text}</u>`;

  return leadingSpace + text + trailingSpace;
};

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// Show draft posts in local dev environment
const isDev = process.env.NODE_ENV === 'development';

// Status filter: Draft + Published in dev, Published only in production
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

// Notion property value extraction helpers
function getTitle(property: any): string {
  if (!property || !property.title) return '';
  return property.title.map((t: any) => t.plain_text).join('');
}

function getRichText(property: any): string {
  if (!property || !property.rich_text) return '';
  return property.rich_text.map((t: any) => {
    // Wrap Notion equation blocks in $ for LaTeX rendering
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

// Convert a Notion page to a Post object
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

// Fetch all published posts
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

  // Calculate read time
  return posts.map((post) => ({
    ...post,
    readTime: calculateReadTime(post.description),
  }));
}

// Fetch a single post by slug
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

  // Fetch actual body content for accurate read time calculation
  const content = await getPostContent(post.id);
  const readTime = calculateReadTime(content);

  return {
    ...post,
    readTime,
  };
}

// Fetch posts by tag
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

// Fetch posts by series
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

// Fetch all tags
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = [...new Set(posts.map((post) => post.tag))];
  return tags.filter(Boolean);
}

// Fetch all series
export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts();
  const series = [...new Set(posts.map((post) => post.series).filter(Boolean))];
  return series as string[];
}

// Fetch post body content as markdown
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

// Calculate read time based on config.charsPerMinute
export function calculateReadTime(text?: string): number {
  if (!text) return 1;
  const charCount = text.replace(/\s/g, '').length;
  const readTime = Math.ceil(charCount / config.charsPerMinute);
  return Math.max(1, readTime); // minimum 1 minute
}
