import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: 'sillysillyman.kim',
    template: '%s | sillysillyman.kim',
  },
  description: '백엔드 · 인프라 · 알고리즘 — 삽질과 해결의 기록',
  keywords: [
    '개발 블로그',
    'Backend',
    'Spring Boot',
    'Node.js',
    'AWS',
    'Kotlin',
    'TypeScript',
    '트러블슈팅',
    '인프라',
  ],
  authors: [{ name: 'sillysillyman' }],
  creator: 'sillysillyman',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://sillysillyman.kim',
    siteName: 'sillysillyman.kim',
    title: 'sillysillyman.kim',
    description: '백엔드 · 인프라 · 알고리즘 — 삽질과 해결의 기록',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sillysillyman.kim',
    description: '백엔드 · 인프라 · 알고리즘 — 삽질과 해결의 기록',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className="antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors"
        style={{
          fontFamily: "'Pretendard Variable', 'Noto Sans KR', -apple-system, sans-serif",
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
