'use client';

import { useEffect, useState } from 'react';
import type { AOPaxEntry } from '@/types/challenge';

interface AOModalProps {
  aoName: string;
  onClose: () => void;
}

const CATEGORIES: { key: keyof AOPaxEntry; label: string }[] = [
  { key: 'corePoints', label: 'Core' },
  { key: 'chestPoints', label: 'Chest' },
  { key: 'backPoints', label: 'Back' },
  { key: 'bicepsPoints', label: 'Biceps' },
  { key: 'tricepsPoints', label: 'Triceps' },
  { key: 'legsPoints', label: 'Legs' },
];

export default function AOModal({ aoName, onClose }: AOModalProps) {
  const [pax, setPax] = useState<AOPaxEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/ao/${encodeURIComponent(aoName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPax(data.pax);
      })
      .catch(() => setError('Could not load AO data.'))
      .finally(() => setLoading(false));
  }, [aoName]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const totalPoints = pax.reduce((s, p) => s + p.totalPoints, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="font-black text-f3navy dark:text-white text-base">{aoName}</h2>
            {!loading && !error && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {pax.length} PAX &nbsp;·&nbsp; {totalPoints.toLocaleString()} total pts
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-4 py-3 space-y-3">
          {loading && (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">Loading…</p>
          )}
          {error && (
            <p className="text-center text-red-500 text-sm py-8">{error}</p>
          )}
          {!loading && !error && pax.length === 0 && (
            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No submissions for this AO yet.</p>
          )}
          {!loading && !error && pax.map((entry, i) => (
            <div key={entry.paxName} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-medium w-5 text-right">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{entry.paxName}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {entry.submissionCount} day{entry.submissionCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="text-sm font-black text-f3navy dark:text-f3yellow">
                  {entry.totalPoints.toLocaleString()} pts
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {CATEGORIES.filter((c) => (entry[c.key] as number) > 0).map((c) => (
                  <div key={c.key} className="bg-gray-50 dark:bg-gray-900 rounded-lg px-2 py-1 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.label}</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{entry[c.key] as number}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
