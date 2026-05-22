'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import InfiniteScroll from '@/components/InfiniteScroll';
import { Post } from '@/lib/types';
import { getSeriesInfo } from '@/lib/constants';
import { config } from '@/lib/config';

interface HomeShellProps {
  posts: Post[];
}

export default function HomeShell({ posts }: HomeShellProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('전체');
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  // Sync filter state with URL params after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    if (tag) setActiveTag(tag);
  }, []);

  // Fetch view counts client-side (changes too often to SSR).
  useEffect(() => {
    if (posts.length === 0) return;
    const slugs = posts.map((p) => p.slug).join(',');
    fetch(`/api/views?slugs=${slugs}`)
      .then((res) => res.json())
      .then((counts) => setViewCounts(counts))
      .catch(() => {});
  }, [posts]);

  const filteredPosts = posts.filter((post) => {
    if (activeSeries && post.series !== activeSeries) return false;
    if (!activeSeries && activeTag !== '전체' && post.tag !== activeTag) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tag.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const hasMore = visibleCount < filteredPosts.length;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setLoadingMore(false);
    }, 450);
  }, [loadingMore, hasMore]);

  // Reset visibleCount on filter change.
  useEffect(() => {
    setVisibleCount(6);
  }, [activeTag, activeSeries, searchQuery]);

  const handleTagSelect = (tag: string) => {
    setActiveTag(tag);
    setActiveSeries(null);
    setSearchQuery('');
    router.replace(tag === '전체' ? '/' : `/?tag=${tag}`, { scroll: false });
  };

  const handleSeriesSelect = (seriesId: string) => {
    if (activeSeries === seriesId) {
      setActiveSeries(null);
      setActiveTag('전체');
    } else {
      setActiveSeries(seriesId);
      setActiveTag('전체');
    }
    setSearchQuery('');
  };

  const seriesInfo = activeSeries ? getSeriesInfo(activeSeries) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <section className="max-w-[1100px] 2xl:max-w-[1400px] mx-auto px-6 pt-10 pb-2 animate-in fade-in duration-400">
        <h1 className="text-[28px] font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight tracking-tighter mb-1.5">
          {config.name} 엔지니어링 블로그
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed tracking-tight">
          {config.description}
          <span className="text-zinc-400 dark:text-zinc-600 ml-3 text-[12.5px]">
            총 {posts.length}편
          </span>
        </p>
      </section>

      {searchQuery.trim() && (
        <section className="max-w-[1100px] 2xl:max-w-[1400px] mx-auto px-6 pt-3 animate-in fade-in duration-150">
          <div className="text-[12.5px] text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="text-zinc-400 dark:text-zinc-600"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            &quot;<strong className="text-zinc-900 dark:text-zinc-100">{searchQuery}</strong>
            &quot; 검색 결과{' '}
            <strong className="text-blue-700 dark:text-blue-400">{filteredPosts.length}</strong>건
          </div>
        </section>
      )}

      {seriesInfo && (
        <section className="max-w-[1100px] 2xl:max-w-[1400px] mx-auto px-6 pt-3 animate-in fade-in duration-200">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border-2 text-[13px]"
            style={{ borderColor: `${seriesInfo.emoji === '🐝' ? '#F59E0B' : '#1D4ED8'}33` }}
          >
            <span>{seriesInfo.emoji}</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{seriesInfo.label}</span>
            <span className="text-zinc-500 dark:text-zinc-600 text-xs">
              {filteredPosts.length}편
            </span>
            <button
              onClick={() => setActiveSeries(null)}
              className="ml-1 p-0.5 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400"
              aria-label="시리즈 필터 해제"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </section>
      )}

      <div className="max-w-[1100px] 2xl:max-w-[1400px] mx-auto px-6 py-5 flex-1 w-full lg:flex lg:gap-7 lg:items-start">
        <main className="flex-1 min-w-0">
          {filteredPosts.length === 0 ? (
            <div className="py-20 animate-in fade-in duration-300">
              <div className="text-sm text-zinc-400 dark:text-zinc-600">
                {searchQuery ? '검색 결과가 없습니다' : '아직 작성된 글이 없습니다'}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[18px]">
                {/* All cards rendered to HTML for crawler discovery; rows past visibleCount are hidden until infinite scroll reveals them. */}
                {filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className={index >= visibleCount ? 'hidden' : ''}
                  >
                    <PostCard post={post} index={index} viewCount={viewCounts[post.slug]} />
                  </div>
                ))}
              </div>

              <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} loading={loadingMore} />
            </>
          )}
        </main>

        <Sidebar
          posts={posts}
          activeTag={activeTag}
          activeSeries={activeSeries}
          onTagSelect={handleTagSelect}
          onSeriesSelect={handleSeriesSelect}
        />
      </div>

      <Footer />
    </div>
  );
}
