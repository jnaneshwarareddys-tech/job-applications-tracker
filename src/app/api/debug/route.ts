import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const url = process.env.REDIS_URL || '';
  const isHttps = url.startsWith('https://');
  const isRedis = url.startsWith('redis://');
  const hasToken = !!process.env.REDIS_TOKEN;
  return NextResponse.json({ isHttps, isRedis, hasToken, length: url.length });
}
