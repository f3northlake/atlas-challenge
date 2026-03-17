'use client';

interface PointsPreviewProps {
  core: number;
  chest: number;
  back: number;
  biceps: number;
  triceps: number;
}

export default function PointsPreview({ core, chest, back, biceps, triceps }: PointsPreviewProps) {
  const total = core + chest + back + biceps + triceps;

  return (
    <div className="sticky bottom-0 z-10 bg-f3navy border-t-2 border-f3yellow text-white">
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex flex-wrap justify-between text-xs text-gray-300 mb-1 gap-x-3">
          <span>Core: <strong className="text-white">{core}</strong></span>
          <span>Chest: <strong className="text-white">{chest}</strong></span>
          <span>Back: <strong className="text-white">{back}</strong></span>
          <span>Biceps: <strong className="text-white">{biceps}</strong></span>
          <span>Triceps: <strong className="text-white">{triceps}</strong></span>
        </div>
        <div className="text-center text-f3yellow font-bold text-lg leading-none">
          TOTAL: {total} pts
        </div>
      </div>
    </div>
  );
}
