'use client';

import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export default function InfiniteScroll({ onLoadMore, hasMore, loading }: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, loading]);

  if (!hasMore) {
    return (
      <div className="text-center py-8 text-xs text-zinc-400 dark:text-zinc-600">
        — 모든 글을 불러왔습니다 —
      </div>
    );
  }

  return (
    <div ref={observerRef} className="flex justify-center py-10 gap-1.5">
      {loading &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"
            style={{
              animationDelay: `${i * 0.13}s`,
            }}
          />
        ))}
    </div>
  );
}
