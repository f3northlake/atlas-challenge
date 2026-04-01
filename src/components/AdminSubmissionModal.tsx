'use client';

import { useEffect } from 'react';
import type { AdminSubmission, ExerciseCategory } from '@/types/challenge';
import { EXERCISES } from '@/lib/constants';

interface AdminSubmissionModalProps {
  submission: AdminSubmission;
  onClose: () => void;
}

const CATEGORY_ORDER: ExerciseCategory[] = ['core', 'chest', 'back', 'biceps', 'triceps', 'legs'];

function formatWeight(set: AdminSubmission['sets'][number]): string {
  if (set.weightLeft === 0 && set.weightRight === 0) return '—';
  if (set.isTwoDumbbell) {
    if (set.weightLeft === set.weightRight) return `${set.weightLeft} lb ×2`;
    return `${set.weightLeft}/${set.weightRight} lb`;
  }
  return `${set.weightLeft} lb`;
}

export default function AdminSubmissionModal({ submission, onClose }: AdminSubmissionModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const formattedDate = new Date(submission.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  const formattedTimestamp = new Date(submission.timestamp).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  // Group sets by category in display order
  const setsByCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: EXERCISES[cat].label,
    emoji: EXERCISES[cat].emoji,
    sets: submission.sets.filter((s) => s.category === cat),
  })).filter((g) => g.sets.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="font-black text-f3navy dark:text-white text-base">
              {submission.paxName}
              <span className="ml-2 font-normal text-gray-500 dark:text-gray-400 text-sm">{submission.homeAO}</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {formattedDate} &nbsp;·&nbsp; submitted {formattedTimestamp}
            </p>
            <p className="text-sm font-black text-f3navy dark:text-f3yellow mt-1">
              {submission.totalPoints.toLocaleString()} pts &nbsp;·&nbsp; {submission.sets.length} set{submission.sets.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none font-bold ml-4 shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-4 py-3 space-y-4">
          {submission.sets.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No set details available.</p>
          )}

          {setsByCategory.map(({ cat, label, emoji, sets }) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {emoji} {label}
              </h3>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                      <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Exercise</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right">Reps</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right">Weight</th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {sets.map((set, i) => (
                      <tr key={set.id ?? i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-3 py-2 text-gray-800 dark:text-gray-200">
                          {set.exerciseType}
                          {set.multiplier === 2 && (
                            <span className="ml-1.5 text-xs bg-f3yellow/20 text-f3navy dark:text-f3yellow font-bold px-1 rounded">
                              2×
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">{set.reps}</td>
                        <td className="px-3 py-2 text-right text-gray-500 dark:text-gray-400">{formatWeight(set)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-f3navy dark:text-f3yellow">{set.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
