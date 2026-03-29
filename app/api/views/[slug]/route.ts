import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';

const prefix = process.env.NODE_ENV === 'production' ? 'views' : 'views:dev';

function isRedisConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function getRedis() {
  const { redis } = await import('@/lib/redis');
  return redis;
}

let ratelimit: Ratelimit | null = null;
async function getRatelimit() {
  if (!ratelimit) {
    const redis = await getRedis();
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
    });
  }
  return ratelimit;
}

function getIP(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
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
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ views: null });
  }

  if (process.env.NODE_ENV === 'production') {
    const referer = request.headers.get('referer');
    const siteUrl = process.env.SITE_URL;
    if (siteUrl && referer && !referer.startsWith(siteUrl)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const ip = getIP(request);
  const limiter = await getRatelimit();
  const { success } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { slug } = await params;
  const redis = await getRedis();
  const views = await redis.incr(`${prefix}:${slug}`);
  return NextResponse.json({ views });
}
