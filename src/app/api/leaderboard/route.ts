import { NextResponse } from 'next/server';
import { getLeaderboardData } from '@/lib/sheets';

// Cache for 60 seconds so the leaderboard isn't hammered on every load
export const revalidate = 60;

export async function GET() {
  try {
    const data = await getLeaderboardData();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Leaderboard error:', err);
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 });
  }
}
