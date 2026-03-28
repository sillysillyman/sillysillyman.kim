import { NextRequest, NextResponse } from 'next/server';

const prefix = process.env.NODE_ENV === 'production' ? 'views' : 'views:dev';

function isRedisConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

// GET /api/views?slugs=slug1,slug2,slug3
export async function GET(request: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json({});
  }

  const slugs = request.nextUrl.searchParams.get('slugs')?.split(',').filter(Boolean);
  if (!slugs || slugs.length === 0) {
    return NextResponse.json({});
  }

  const { redis } = await import('@/lib/redis');
  const keys = slugs.map((slug) => `${prefix}:${slug}`);
  const values = await redis.mget<(number | null)[]>(...keys);

  const result: Record<string, number> = {};
  slugs.forEach((slug, i) => {
    result[slug] = values[i] || 0;
  });

  return NextResponse.json(result);
}
