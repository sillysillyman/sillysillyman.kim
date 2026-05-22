import { Suspense } from 'react';
import { getAllPosts } from '@/lib/notion';
import { config } from '@/lib/config';
import HomeShell from '@/components/HomeShell';

export const revalidate = 60;

export default async function Home() {
  const posts = await getAllPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: config.url,
    name: config.name,
    description: config.description,
    inLanguage: config.language,
    publisher: {
      '@type': 'Person',
      name: config.author.name,
      url: config.author.github,
    },
    blogPost: posts.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${config.url}/posts/${post.slug}`,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: config.author.name },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <HomeShell posts={posts} />
      </Suspense>
    </>
  );
}
