import { NextRequest, NextResponse } from 'next/server';

const prefix = process.env.NODE_ENV === 'production' ? 'views' : 'views:dev';

function isRedisConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function getRedis() {
  const { redis } = await import('@/lib/redis');
  return redis;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ views: null });
  }
  const { slug } = await params;
  const redis = await getRedis();
  const views = (await redis.get<number>(`${prefix}:${slug}`)) || 0;
  return NextResponse.json({ views });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ views: null });
  }
  const { slug } = await params;
  const redis = await getRedis();
  const views = await redis.incr(`${prefix}:${slug}`);
  return NextResponse.json({ views });
}
