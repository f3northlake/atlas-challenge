import ChallengeForm from '@/components/ChallengeForm';

export default function HomePage() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-black text-f3navy">Atlas Challenge</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Log your daily reps below. Points are tallied automatically.
        </p>
      </div>
      <ChallengeForm />
    </>
  );
}
