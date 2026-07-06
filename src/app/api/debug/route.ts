import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const keys = Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('UPSTASH') || k.includes('STORAGE'));
  return NextResponse.json({ keys });
}
