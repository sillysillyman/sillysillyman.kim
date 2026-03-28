'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathProps {
  text: string;
}

// Component that renders $...$ syntax with KaTeX
export default function InlineMath({ text }: InlineMathProps) {
  // Split by $...$ patterns and convert to KaTeX HTML
  const parts = text.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\$([^$]+)\$$/);
        if (match) {
          const html = katex.renderToString(match[1], {
            throwOnError: false,
            output: 'html',
          });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
