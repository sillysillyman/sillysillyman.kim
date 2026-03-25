'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    // 기존 iframe 제거 (테마 변경 시 재렌더링)
    const existingIframe = ref.current.querySelector('iframe.giscus-frame');
    if (existingIframe) existingIframe.remove();

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'sillysillyman/sillysillyman.kim');
    script.setAttribute('data-repo-id', 'R_kgDORvnVJA');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDORvnVJM4C5QiD');
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
