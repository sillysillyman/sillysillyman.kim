'use client';

import { TAG_MAP, SERIES_MAP } from '@/lib/constants';
import { Post } from '@/lib/types';

interface SidebarProps {
  posts: Post[];
  activeTag: string;
  activeSeries: string | null;
  onTagSelect: (tag: string) => void;
  onSeriesSelect: (seriesId: string) => void;
}

export default function Sidebar({
  posts,
  activeTag,
  activeSeries,
  onTagSelect,
  onSeriesSelect,
}: SidebarProps) {
  // 태그별 글 개수 계산
  const tagCounts = Object.keys(TAG_MAP).reduce(
    (acc, tagId) => {
      acc[tagId] = posts.filter((p) => p.tag === tagId).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  // 시리즈별 글 개수 계산
  const seriesCounts = Object.keys(SERIES_MAP).reduce(
    (acc, seriesId) => {
      acc[seriesId] = posts.filter((p) => p.series === seriesId).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <aside className="hidden lg:flex w-[220px] flex-shrink-0 sticky top-[76px] flex-col gap-5">
      {/* 시리즈 목록 */}
      <div>
        <div className="text-[11.5px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-2.5">
          시리즈
        </div>
        <div className="flex flex-col gap-0.5">
          {Object.values(SERIES_MAP).map((series) => {
            const isActive = activeSeries === series.id;
            const count = seriesCounts[series.id] || 0;

            if (count === 0) return null;

            return (
              <button
                key={series.id}
                onClick={() => onSeriesSelect(series.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all text-left w-full ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                <span className="text-base flex-shrink-0">{series.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[13px] ${
                      isActive ? 'font-bold' : 'font-medium'
                    } text-zinc-700 dark:text-zinc-300 truncate tracking-tight`}
                  >
                    {series.label}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold flex-shrink-0 ${
                    isActive
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 프로필 카드 */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[16px] font-extrabold text-blue-700 dark:text-blue-400 font-mono">
            &lt;/&gt;
          </span>
          <div>
            <div className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              sillysillyman
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-600">Backend Developer</div>
          </div>
        </div>
        <p className="text-[11.5px] leading-relaxed text-zinc-600 dark:text-zinc-400 mb-0">
          Kotlin/Spring Boot, Node.js, AWS 기반 백엔드 개발을 하고 있습니다.
        </p>
        <div className="flex gap-2 mt-3">
          <a
            href="https://github.com/sillysillyman"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold px-2.5 py-1 rounded-md bg-blue-700/10 hover:bg-blue-700/20 transition-colors"
          >
            GitHub
          </a>
          {/* <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold px-2.5 py-1 rounded-md bg-blue-700/10 hover:bg-blue-700/20 transition-colors"
          >
            LinkedIn
          </a> */}
        </div>
      </div>

      {/* 태그 클라우드 */}
      <div>
        <div className="text-[11.5px] font-bold text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-2.5">
          태그
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onTagSelect('전체')}
            className={`text-[11px] px-2 py-1 rounded-md transition-all whitespace-nowrap ${
              activeTag === '전체' && !activeSeries
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-bold'
                : 'text-zinc-500 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            전체
          </button>
          {Object.values(TAG_MAP).map((tag) => {
            const isActive = activeTag === tag.id && !activeSeries;
            const count = tagCounts[tag.id] || 0;

            if (count === 0) return null;

            return (
              <button
                key={tag.id}
                onClick={() => onTagSelect(tag.id)}
                className={`text-[11px] px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? `font-semibold border`
                    : 'text-zinc-500 dark:text-zinc-600 hover:opacity-80'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: tag.color.from + '15',
                        color: tag.color.from,
                        borderColor: tag.color.from + '33',
                      }
                    : {}
                }
              >
                {tag.emoji} {tag.label} <span className="opacity-50">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
