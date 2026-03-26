'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import InfiniteScroll from '@/components/InfiniteScroll';
import { Post } from '@/lib/types';
import { getSeriesInfo } from '@/lib/constants';

// 서버 컴포넌트에서 데이터를 가져오는 대신, 클라이언트에서 fetch
export default function Home() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '전체');
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // 필터링 로직
  const filteredPosts = posts.filter((post) => {
    // 시리즈 필터
    if (activeSeries && post.series !== activeSeries) return false;

    // 태그 필터
    if (!activeSeries && activeTag !== '전체' && post.tag !== activeTag) return false;

    // 검색 필터
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

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  // 무한 스크롤 로드 더보기
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 3);
      setLoadingMore(false);
    }, 450);
  }, [loadingMore, hasMore]);

  // 필터 변경 시 visibleCount 리셋
  useEffect(() => {
    setVisibleCount(6);
  }, [activeTag, activeSeries, searchQuery]);

  // 태그 선택 핸들러
  const handleTagSelect = (tag: string) => {
    setActiveTag(tag);
    setActiveSeries(null);
    setSearchQuery('');
  };

  // 시리즈 선택 핸들러
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-700 animate-pulse"
              style={{ animationDelay: `${i * 0.13}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const seriesInfo = activeSeries ? getSeriesInfo(activeSeries) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      {/* 히어로 섹션 */}
      <section className="max-w-[1100px] mx-auto px-6 pt-10 pb-2 animate-in fade-in duration-400">
        <h1 className="text-[28px] font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight tracking-tighter mb-1.5">
          개발하며 배운 것들 <span className="text-2xl">✍️</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed tracking-tight">
          백엔드 · 인프라 · 알고리즘 — 삽질과 해결의 기록
          <span className="text-zinc-400 dark:text-zinc-600 ml-3 text-[12.5px]">
            총 {posts.length}편
          </span>
        </p>
      </section>

      {/* 검색 결과 정보 */}
      {searchQuery.trim() && (
        <section className="max-w-[1100px] mx-auto px-6 pt-3 animate-in fade-in duration-150">
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

      {/* 활성 시리즈 배너 */}
      {seriesInfo && (
        <section className="max-w-[1100px] mx-auto px-6 pt-3 animate-in fade-in duration-200">
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

      {/* 메인 콘텐츠: 포스트 그리드 + 사이드바 */}
      <div className="max-w-[1100px] mx-auto px-6 py-5 flex-1 w-full lg:flex lg:gap-7 lg:items-start">
        {/* 포스트 그리드 */}
        <main className="flex-1 min-w-0">
          {visiblePosts.length === 0 ? (
            <div className="py-20 animate-in fade-in duration-300">
              <div className="text-sm text-zinc-400 dark:text-zinc-600">
                {searchQuery ? '검색 결과가 없습니다' : '아직 작성된 글이 없습니다'}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {visiblePosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>

              {/* 무한 스크롤 */}
              <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} loading={loadingMore} />
            </>
          )}
        </main>

        {/* 사이드바 */}
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
