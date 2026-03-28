'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { config } from '@/lib/config';

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current || !config.giscus.repo) return;

    // Remove existing iframe (re-render on theme change)
    const existingIframe = ref.current.querySelector('iframe.giscus-frame');
    if (existingIframe) existingIframe.remove();

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', config.giscus.repo);
    script.setAttribute('data-repo-id', config.giscus.repoId);
    script.setAttribute('data-category', config.giscus.category);
    script.setAttribute('data-category-id', config.giscus.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    const siteUrl = window.location.origin;
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? `${siteUrl}/giscus-dark.css` : `${siteUrl}/giscus-light.css`);
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    ref.current.appendChild(script);
  }, [resolvedTheme]);

  return <div ref={ref} className="mt-10" />;
}
