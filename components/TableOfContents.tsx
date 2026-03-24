'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isClickScrolling, setIsClickScrolling] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 클릭으로 스크롤 중일 때는 Observer 업데이트 무시
        if (isClickScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items, isClickScrolling]);

  const handleClick = (id: string) => {
    // 클릭 즉시 해당 항목 하이라이팅
    setActiveId(id);
    setIsClickScrolling(true);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 스크롤 애니메이션 완료 후 Observer 다시 활성화
    setTimeout(() => {
      setIsClickScrolling(false);
    }, 1000);
  };

  return (
    <nav className="sticky top-20">
      <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-3.5">
        목차
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`text-left py-1.5 px-3 text-xs transition-all border-l-2 ${
                item.level === 3 ? 'ml-3' : ''
              } ${
                isActive
                  ? 'border-blue-700 text-blue-700 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400'
              }`}
            >
              {item.text}
            </button>
          );
        })}
      </div>

      {/* 공유 버튼 */}
      <div className="pt-5 mt-5 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-2.5">
          공유
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('링크가 복사되었습니다!');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[11.5px] font-medium hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          링크 복사
        </button>
      </div>
    </nav>
  );
}
