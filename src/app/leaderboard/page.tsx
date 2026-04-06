import Link from 'next/link';
import LeaderboardTable from '@/components/LeaderboardTable';
import { getLeaderboardData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  let data = { individuals: [] as Awaited<ReturnType<typeof getLeaderboardData>>['individuals'], aos: [] as Awaited<ReturnType<typeof getLeaderboardData>>['aos'] };
  let error: string | null = null;

  try {
    data = await getLeaderboardData();
  } catch {
    error = 'Could not load leaderboard. Check back soon.';
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-f3navy dark:text-white">Leaderboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Atlas Challenge standings</p>
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
    </div>
  );
}
