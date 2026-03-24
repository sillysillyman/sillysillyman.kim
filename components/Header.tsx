'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Header({ onSearch, searchQuery }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      onSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-xl">
      <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
        <div
          onClick={() => {
            onSearch('');
            setSearchOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <span className="text-[15px] font-extrabold text-blue-700 dark:text-blue-400 font-mono">
            &lt;/&gt;
          </span>
          <span className="text-[15px] font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            sillysillyman
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {searchOpen && (
            <div className="flex items-center relative animate-in fade-in duration-200">
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="검색..."
                className="w-[220px] h-[34px] px-3 pr-8 rounded-lg border-2 border-blue-700/40 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[13px] outline-none placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-2 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleSearchToggle}
            className={`w-[34px] h-[34px] rounded-lg ${searchOpen ? 'bg-blue-700/15 text-blue-700 dark:text-blue-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'} flex items-center justify-center transition-all hover:scale-105`}
          >
            {searchOpen ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
          </button>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-[34px] h-[34px] rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm transition-all hover:scale-105"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
