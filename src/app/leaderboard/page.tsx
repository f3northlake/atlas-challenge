import Link from 'next/link';
import LeaderboardTable from '@/components/LeaderboardTable';
import type { LeaderboardEntry, AOEntry } from '@/types/challenge';

// Revalidate every 60 seconds
export const revalidate = 60;

async function fetchLeaderboard(): Promise<{ individuals: LeaderboardEntry[]; aos: AOEntry[] }> {
  // Use absolute URL for server-side fetch in Next.js
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/leaderboard`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return res.json();
}

export default async function LeaderboardPage() {
  let data: { individuals: LeaderboardEntry[]; aos: AOEntry[] } = { individuals: [], aos: [] };
  let error: string | null = null;

  try {
    data = await fetchLeaderboard();
  } catch {
    error = 'Could not load leaderboard. Check back soon.';
  }

  return (
    <>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-f3navy">Leaderboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Atlas Challenge standings</p>
        </div>
        <Link
          href="/"
          className="text-xs bg-f3yellow text-f3navy font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-400 transition-colors shrink-0 mt-1"
        >
          + Log Reps
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <LeaderboardTable individuals={data.individuals} aos={data.aos} />
      )}
    </>
  );
}
