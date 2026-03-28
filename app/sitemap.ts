import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/notion';
import { config } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = config.url;

  // 모든 포스트 가져오기
  const posts = await getAllPosts();

  // 포스트 URL 생성
  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  // 정적 페이지
  const staticUrls = [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
  ];

  return [...staticUrls, ...postUrls];
}
