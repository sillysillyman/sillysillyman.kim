'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-[34px] h-[34px] rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm transition-all hover:scale-105"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
