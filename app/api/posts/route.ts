import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/notion';

export const revalidate = 60; // ISR: 60초마다 갱신

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
