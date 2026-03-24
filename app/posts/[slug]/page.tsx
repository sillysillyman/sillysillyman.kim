import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPostBySlug, getAllPosts, getPostContent } from '@/lib/notion';
import { getTagInfo, getSeriesInfo } from '@/lib/constants';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// 마크다운에서 heading 추출
function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/`([^`]+)`/g, '$1').trim();
    const id = text
      .replace(/\s+/g, '-')
      .replace(/[^\w가-힣-]/g, '')
      .toLowerCase();
    headings.push({ id, text, level });
  }

  return headings;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.SITE_URL || 'https://sillysillyman.kim';
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  return {
    title: `${post.title} | sillysillyman.kim`,
    description: post.description,
    authors: [{ name: 'sillysillyman' }],
    keywords: [post.tag, 'blog', 'development', '개발', '블로그'],
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      siteName: 'sillysillyman.kim',
      locale: 'ko_KR',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['sillysillyman'],
      tags: [post.tag],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: post.canonicalUrl || postUrl,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = await getPostContent(post.id);
  const tagInfo = getTagInfo(post.tag);
  const seriesInfo = post.series ? getSeriesInfo(post.series) : null;
  const headings = extractHeadings(content);

  // 날짜 포맷팅
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
            <span className="text-[15px] font-extrabold text-blue-700 dark:text-blue-400 font-mono">
              &lt;/&gt;
            </span>
            <span className="text-[15px] font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              sillysillyman
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* 글 헤더 */}
      <div className="max-w-[1100px] mx-auto px-6 pt-12 w-full">
        <div className="max-w-[720px]">
          {/* 태그 — 제목 위에 작게 */}
          {tagInfo && (
            <div className="mb-3">
              <Link
                href={`/?tag=${post.tag}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:opacity-70 transition-opacity"
                style={{ color: tagInfo.color.from }}
              >
                <span>{tagInfo.emoji}</span>
                <span>{tagInfo.label}</span>
              </Link>
            </div>
          )}

          {/* 제목 */}
          <h1 className="text-[34px] font-extrabold text-zinc-900 dark:text-zinc-50 leading-[1.4] tracking-tight mb-4">
            {post.title}
          </h1>

          {/* 설명 */}
          {post.description && (
            <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
              {post.description}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center gap-2 flex-wrap text-[13px] text-zinc-400 dark:text-zinc-600 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">sillysillyman</span>
            <span className="opacity-30">·</span>
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            <span className="opacity-30">·</span>
            <span>{post.readTime || 5}분 읽기</span>
          </div>
        </div>
      </div>

      {/* 본문 + TOC */}
      <div className="max-w-[1100px] mx-auto px-6 py-6 w-full flex gap-14 items-start">
        {/* 본문 */}
        <main className="flex-1 min-w-0 max-w-[720px]">
          <article className="max-w-none">
            <MarkdownRenderer content={content} />
          </article>

          {/* 하단 구분선 */}
          <hr className="border-zinc-200 dark:border-zinc-800 mt-16 mb-8" />

          {/* 목록으로 돌아가기 */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold hover:opacity-90 transition-opacity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              목록으로
            </Link>
          </div>
        </main>

        {/* TOC 사이드바 — 데스크톱에서만 표시 */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-[180px] shrink-0 sticky top-20">
            <TableOfContents items={headings} />
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
}
