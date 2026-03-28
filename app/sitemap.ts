import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/notion';
import { config } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = config.url;

  // Fetch all posts
  const posts = await getAllPosts();

  // Generate post URLs
  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }));

  // Static pages
  const staticUrls = [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
  ];

  return [...staticUrls, ...postUrls];
}
