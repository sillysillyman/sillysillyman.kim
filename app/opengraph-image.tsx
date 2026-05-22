import { ImageResponse } from 'next/og';

export const alt = 'sillysillyman.kim';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 86400;

const PRETENDARD_BOLD_URL =
  'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf';

export default async function OgImage() {
  const boldFont = await fetch(PRETENDARD_BOLD_URL).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1D4ED8',
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            fontSize: 320,
            fontWeight: 700,
            fontFamily: 'Pretendard',
            lineHeight: 1,
          }}
        >
          {'</>'}
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Pretendard', data: boldFont, weight: 700, style: 'normal' }],
    },
  );
}
