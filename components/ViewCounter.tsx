'use client';

import { useEffect, useState } from 'react';

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Skip duplicate increments using sessionStorage
    const key = `viewed:${slug}`;
    const alreadyViewed = sessionStorage.getItem(key);

    if (alreadyViewed) {
      // Already viewed in this session — just fetch the count
      fetch(`/api/views/${slug}`)
        .then((res) => res.json())
        .then((data) => setViews(data.views))
        .catch(() => {});
    } else {
      // First visit in this session — increment
      fetch(`/api/views/${slug}`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          setViews(data.views);
          sessionStorage.setItem(key, '1');
        })
        .catch(() => {});
    }
  }, [slug]);

  if (views === null) return null;

  return (
    <>
      <span className="opacity-30">·</span>
      <span className="inline-flex items-center gap-1">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {views.toLocaleString('ko-KR')}
      </span>
    </>
  );
}
