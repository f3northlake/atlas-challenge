import Link from 'next/link';

interface SuccessPageProps {
  searchParams: Promise<{ points?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const points = parseInt(params.points ?? '0', 10);

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="text-6xl mb-4">💪</div>
      <h1 className="text-3xl font-black text-f3navy dark:text-white mb-2">EH Yeah!</h1>
      <p className="text-gray-600 mb-1">Your points have been recorded.</p>
      {points > 0 && (
        <p className="text-5xl font-black text-f3yellow my-6">
          {points.toLocaleString()} pts
        </p>
      )}
      <p className="text-gray-500 text-sm mb-8">
        Keep grinding — those AO points add up!
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="block bg-f3yellow text-f3navy font-bold py-3 px-6 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Log More Reps
        </Link>
        <Link
          href="/leaderboard"
          className="block bg-f3navy text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-900 transition-colors"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}
