import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/notion';
import { getTagInfo } from '@/lib/constants';
import { config } from '@/lib/config';

export const alt = 'sillysillyman.kim';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

const PRETENDARD_BOLD_URL =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf';
const PRETENDARD_EXTRABOLD_URL =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-ExtraBold.otf';

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const [boldFont, extraBoldFont] = await Promise.all([
    fetch(PRETENDARD_BOLD_URL).then((r) => r.arrayBuffer()),
    fetch(PRETENDARD_EXTRABOLD_URL).then((r) => r.arrayBuffer()),
  ]);

  const title = post?.title ?? 'Post Not Found';
  const tagInfo = post?.tag ? getTagInfo(post.tag) : null;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #09090B 0%, #18181B 45%, #1E293B 100%)',
        padding: '72px 80px',
        fontFamily: 'Pretendard',
      }}
    >
      {/* Top row: logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            color: '#60A5FA',
            fontSize: 44,
            fontWeight: 800,
            fontFamily: 'monospace',
          }}
        >
          {'</>'}
        </span>
        <span
          style={{
            color: '#FAFAFA',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          {config.author.name}
        </span>
      </div>

      {/* Middle: tag + title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {tagInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 30 }}>{tagInfo.emoji}</span>
            <span
              style={{
                color: tagInfo.color.from,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              {tagInfo.label}
            </span>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            color: '#FAFAFA',
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </div>
      </div>

      {/* Bottom: domain */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            color: '#71717A',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          sillysillyman.kim
        </span>
        <span
          style={{
            color: '#3F3F46',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          BACKEND · INFRA · ALGORITHM
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Pretendard', data: boldFont, weight: 700, style: 'normal' },
        { name: 'Pretendard', data: extraBoldFont, weight: 800, style: 'normal' },
      ],
    },
  );
}
