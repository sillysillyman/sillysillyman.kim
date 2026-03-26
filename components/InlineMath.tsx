'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathProps {
  text: string;
}

// $...$ 구문을 KaTeX로 렌더링하는 컴포넌트
export default function InlineMath({ text }: InlineMathProps) {
  // $...$ 패턴을 찾아서 KaTeX HTML로 변환
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
