'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

// React 노드에서 텍스트 추출 (복사 기능용)
function extractText(node: any): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node?.props?.children) return extractText(node.props.children);
  return '';
}

// 코드 블록 컴포넌트
function CodeBlock({ children, className }: { children: any; className?: string }) {
  const [copied, setCopied] = useState(false);

  // className에서 언어 추출 (hljs language-sql → sql)
  const language =
    className
      ?.replace(/^hljs\s+/, '')
      ?.replace('language-', '')
      ?.split(' ')[0]
      ?.toLowerCase() || 'text';

  // 복사용 텍스트 추출
  const plainText = extractText(children);

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden my-7 border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-100 dark:bg-[#1E1E22] border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wide font-mono">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          {copied ? (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              복사됨
            </>
          ) : (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              복사
            </>
          )}
        </button>
      </div>
      <pre className="m-0 px-[22px] py-[18px] overflow-x-auto bg-zinc-50 dark:bg-[#0D1117]">
        <code className={`text-[13px] leading-[1.75] font-mono ${className}`}>{children}</code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // HTML 엔티티 디코딩 (백틱 등)
  let processedContent = content
    .replace(/&#96;/g, '`')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  // summary 태그 안의 인라인 코드만 처리 (details는 건드리지 않음)
  processedContent = processedContent.replace(/<summary>(.*?)<\/summary>/g, (match, inner) => {
    const processed = inner.replace(/`([^`]+)`/g, '<code>$1</code>');
    return `<summary>${processed}</summary>`;
  });

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        // 코드 블록
        pre: ({ children }) => <>{children}</>,
        code: ({ inline, children, className, ...props }: any) => {
          // 인라인 코드 판단: inline이 true이거나 className이 없으면 인라인
          const isInline = inline || !className;

          if (isInline) {
            // 모든 백틱 제거
            let text = String(children).replace(/`/g, '');
            return (
              <code
                className="bg-zinc-100 dark:bg-zinc-800 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono"
                {...props}
              >
                {text}
              </code>
            );
          }
          return <CodeBlock className={className}>{children}</CodeBlock>;
        },
        // 링크
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
            {...props}
          >
            {children}
          </a>
        ),
        // 이미지
        img: ({ src, alt, ...props }) => (
          <img
            src={src}
            alt={alt || ''}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 my-6 w-full"
            {...props}
          />
        ),
        // 인용구
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-3 border-blue-700 pl-4 py-2 my-6 bg-blue-50 dark:bg-blue-950/20 rounded-r-lg pr-4 text-zinc-700 dark:text-zinc-300"
            {...props}
          >
            {children}
          </blockquote>
        ),
        // 테이블
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-6 rounded-[10px] border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full border-collapse text-[13.5px]" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-zinc-100 dark:bg-[#1E1E22]" {...props}>
            {children}
          </thead>
        ),
        th: ({ children, ...props }) => (
          <th
            className="px-4 py-[11px] text-left text-[12.5px] font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td
            className="px-4 py-[11px] text-[13px] text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 last:[&_tr]:border-b-0"
            {...props}
          >
            {children}
          </td>
        ),
        // 제목
        h1: ({ children, ...props }) => {
          const id = extractText(children)
            .replace(/\s+/g, '-')
            .replace(/[^\w가-힣-]/g, '')
            .toLowerCase();
          return (
            <h1
              id={id}
              className="text-3xl font-bold mt-12 mb-4 text-zinc-900 dark:text-zinc-50 scroll-mt-20"
              {...props}
            >
              {children}
            </h1>
          );
        },
        h2: ({ children, ...props }) => {
          const id = extractText(children)
            .replace(/\s+/g, '-')
            .replace(/[^\w가-힣-]/g, '')
            .toLowerCase();
          return (
            <h2
              id={id}
              className="text-[22px] font-bold mt-12 mb-4 text-zinc-900 dark:text-zinc-50 scroll-mt-20"
              {...props}
            >
              {children}
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const id = extractText(children)
            .replace(/\s+/g, '-')
            .replace(/[^\w가-힣-]/g, '')
            .toLowerCase();
          return (
            <h3
              id={id}
              className="text-[17px] font-semibold mt-9 mb-3 text-zinc-900 dark:text-zinc-50 scroll-mt-20"
              {...props}
            >
              {children}
            </h3>
          );
        },
        // 리스트
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-outside ml-5 my-4 space-y-2" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-outside ml-5 my-4 space-y-2" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="text-zinc-700 dark:text-zinc-300 leading-relaxed" {...props}>
            {children}
          </li>
        ),
        // 단락
        p: ({ children, ...props }) => (
          <div
            className="my-4 leading-[1.9] text-[15.5px] text-zinc-700 dark:text-zinc-300"
            {...props}
          >
            {children}
          </div>
        ),
        // 수평선
        hr: ({ ...props }) => (
          <hr className="my-12 border-zinc-200 dark:border-zinc-800" {...props} />
        ),
        // 강조
        strong: ({ children, ...props }) => (
          <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props}>
            {children}
          </strong>
        ),
        // 토글/접기 - Notion 스타일 (배경 없이 깔끔하게)
        details: ({ children, ...props }) => (
          <details className="my-4" {...props}>
            {children}
          </details>
        ),
        summary: ({ children, ...props }) => (
          <summary
            className="cursor-pointer list-none text-zinc-900 dark:text-zinc-100 leading-relaxed [&::-webkit-details-marker]:hidden flex items-start gap-1.5"
            {...props}
          >
            <span className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-600 transition-transform [details[open]_&]:rotate-90 shrink-0">
              ▶
            </span>
            <span>{children}</span>
          </summary>
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}
