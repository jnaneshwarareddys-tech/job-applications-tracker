import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize optionally so it doesn't crash builds or local environments without KV
const getRedis = () => {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return Redis.fromEnv();
  }
  return null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    const redis = getRedis();
    if (!redis) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await redis.get(key);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Redis GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }

    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ error: 'Redis is not configured on Vercel yet' }, { status: 503 });
    }

    const { data } = await request.json();
    
    // Save the entire array to Redis under the given key
    await redis.set(key, data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redis POST Error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
