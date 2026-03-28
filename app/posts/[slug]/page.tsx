import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPostBySlug, getAllPosts, getPostContent } from '@/lib/notion';
import { getTagInfo, getSeriesInfo } from '@/lib/constants';
import { config } from '@/lib/config';
import { extractHeadings } from '@/lib/latex';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import Giscus from '@/components/Giscus';
import InlineMath from '@/components/InlineMath';
import ViewCounter from '@/components/ViewCounter';

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
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

  const siteUrl = config.url;
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  return {
    title: `${post.title} | ${config.name}`,
    description: post.description,
    authors: [{ name: config.author.name }],
    keywords: [post.tag, 'blog', 'development', '개발', '블로그'],
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      siteName: config.name,
      locale: config.locale,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [config.author.name],
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

  // Date formatting
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
            <span className="text-[15px] font-extrabold text-blue-700 dark:text-blue-400 font-mono">
              &lt;/&gt;
            </span>
            <span className="text-[15px] font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {config.author.name}
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Post header */}
      <div className="max-w-[1100px] mx-auto px-6 pt-12 w-full">
        <div className="max-w-[720px]">
          {/* Tag — small, above title */}
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

          {/* Title */}
          <h1 className="text-[34px] font-extrabold text-zinc-900 dark:text-zinc-50 leading-[1.4] tracking-tight mb-4">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
              <InlineMath text={post.description} />
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-2 flex-wrap text-[13px] text-zinc-400 dark:text-zinc-600 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">{config.author.name}</span>
            <span className="opacity-30">·</span>
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            <span className="opacity-30">·</span>
            <span>{post.readTime || 5}분 읽기</span>
            <ViewCounter slug={post.slug} />
          </div>
        </div>
      </div>

      {/* Content + TOC */}
      <div className="max-w-[1100px] mx-auto px-6 py-6 w-full flex gap-14 items-start">
        {/* Article body */}
        <main className="flex-1 min-w-0 max-w-[720px]">
          <article className="max-w-none">
            <MarkdownRenderer content={content} headings={headings} />
          </article>

          {/* Comments */}
          <Giscus />

          {/* Bottom divider */}
          <hr className="border-zinc-200 dark:border-zinc-800 mt-16 mb-8" />

          {/* Back to list */}
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

        {/* TOC sidebar — desktop only */}
        {headings.filter(h => h.level >= 2).length > 0 && (
          <aside className="hidden lg:block w-[180px] shrink-0 sticky top-20">
            <TableOfContents items={headings.filter(h => h.level >= 2)} />
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
}
