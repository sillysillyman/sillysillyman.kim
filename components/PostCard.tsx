'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { getTagInfo, getSeriesInfo } from '@/lib/constants';
import InlineMath from '@/components/InlineMath';
import { config } from '@/lib/config';

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const tagInfo = getTagInfo(post.tag);
  const seriesInfo = post.series ? getSeriesInfo(post.series) : null;

  // Thumbnail gradient colors (tag-based)
  const seeds = [
    ['#0F172A', '#1D4ED8', '#818CF8'],
    ['#1E1B4B', '#A78BFA', '#C4B5FD'],
    ['#0C0A09', '#F97316', '#FDBA74'],
    ['#022C22', '#10B981', '#6EE7B7'],
    ['#1C1917', '#EF4444', '#FCA5A5'],
    ['#0F172A', '#3B82F6', '#93C5FD'],
    ['#18181B', '#E11D48', '#FB7185'],
    ['#1A2E05', '#84CC16', '#BEF264'],
  ];
  const colors = seeds[parseInt(post.id) % seeds.length] || seeds[0];

  // Format date (YYYY-MM-DD -> YYYY.MM.DD)
  const formattedDate = post.publishedAt ? post.publishedAt.replace(/-/g, '.') : '';

  return (
    <Link href={`/posts/${post.slug}`}>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-out hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/30"
        style={{
          animation: `cardUp 0.4s ease ${index * 0.05}s both`,
        }}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video">
          {post.thumbnail ? (
            /* Notion image thumbnail */
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out"
              style={{ transform: isHovered ? 'scale(1.03)' : 'scale(1)' }}
            />
          ) : (
            /* Gradient fallback */
            <div
              className="w-full h-full transition-transform duration-500 ease-out"
              style={{
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                background: `linear-gradient(145deg, ${colors[0]} 0%, ${colors[0]}dd 60%, ${colors[1]}22 100%)`,
              }}
            >
              <div
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${colors[1]}33, transparent 70%)`,
                }}
              />
              <div
                className="absolute -left-5 -bottom-5 w-20 h-20 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${colors[2]}22, transparent 70%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[36px] opacity-10">
                {tagInfo?.emoji || '📄'}
              </div>
              <div className="absolute left-5 top-5 flex flex-col gap-1.5">
                <div
                  className="w-12 h-0.5 rounded-full"
                  style={{ backgroundColor: `${colors[1]}44` }}
                />
                <div
                  className="w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: `${colors[2]}33` }}
                />
              </div>
            </div>
          )}

          {/* Tag & pin badge */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5 items-center">
            {tagInfo && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                style={{
                  backgroundColor: tagInfo.color.from + '15',
                  color: tagInfo.color.from,
                  border: `1px solid ${tagInfo.color.from}33`,
                }}
              >
                {tagInfo.emoji} {tagInfo.label}
              </span>
            )}
            {post.pinned && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/50 text-white backdrop-blur-sm">
                PIN
              </span>
            )}
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 pb-[18px] flex flex-col h-[160px]">
          {/* Series info */}
          {seriesInfo && (
            <div
              className="inline-flex items-center gap-1 text-[10.5px] font-semibold mb-1.5"
              style={{ color: tagInfo?.color.from || '#1D4ED8' }}
            >
              <span>{seriesInfo.emoji}</span>
              <span>{seriesInfo.label}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-[15px] font-bold leading-snug text-zinc-900 dark:text-zinc-50 mb-1.5 line-clamp-2 tracking-tight">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-[12.5px] leading-relaxed text-zinc-600 dark:text-zinc-400 mb-3.5 line-clamp-2">
            <InlineMath text={post.description} />
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
            <span className="text-[11.5px] text-zinc-400 dark:text-zinc-600">{config.author.name}</span>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-600">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
