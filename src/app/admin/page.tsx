'use client';

import { useEffect, useState, useMemo } from 'react';
import type { AdminSubmission } from '@/types/challenge';
import { AO_LIST } from '@/lib/constants';
import AdminSubmissionModal from '@/components/AdminSubmissionModal';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paxFilter, setPaxFilter] = useState('');
  const [aoFilter, setAoFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selected, setSelected] = useState<AdminSubmission | null>(null);

  useEffect(() => {
    fetch('/api/admin/submissions')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSubmissions(data.submissions);
      })
      .catch(() => setError('Could not load submissions.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchPax = s.paxName.toLowerCase().includes(paxFilter.toLowerCase().trim());
      const matchAO = aoFilter === '' || s.homeAO === aoFilter;
      const matchDate = dateFilter === '' || s.date === dateFilter;
      return matchPax && matchAO && matchDate;
    });
  }, [submissions, paxFilter, aoFilter, dateFilter]);

  const totalPoints = filtered.reduce((sum, s) => sum + s.totalPoints, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-f3navy dark:text-white">Admin — All Submissions</h1>
        {!loading && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {filtered.length} submission{filtered.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {totalPoints.toLocaleString()} pts shown
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Filter by PAX name…"
          value={paxFilter}
          onChange={(e) => setPaxFilter(e.target.value)}
          className="flex-1 min-w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-f3navy dark:focus:ring-f3yellow"
        />
        <select
          value={aoFilter}
          onChange={(e) => setAoFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-f3navy dark:focus:ring-f3yellow"
        >
          <option value="">All AOs</option>
          {AO_LIST.map((ao) => (
            <option key={ao} value={ao}>{ao}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-f3navy dark:focus:ring-f3yellow"
        />
      </div>

      {/* Table */}
      {loading && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-12">Loading…</p>
      )}
      {error && (
        <p className="text-center text-red-500 text-sm py-12">{error}</p>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-12">No submissions match your filters.</p>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">PAX</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">AO</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right">Pts</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Core</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Chest</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Back</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Bis</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Tris</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Legs</th>
                  <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">Sets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((sub, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelected(sub)}
                    className="hover:bg-blue-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">{sub.paxName}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs">{sub.homeAO}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                      {new Date(sub.date + 'T12:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-3 py-2 text-right font-black text-f3navy dark:text-f3yellow">{sub.totalPoints}</td>
                    <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">{sub.corePoints || '—'}</td>
                    <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">{sub.chestPoints || '—'}</td>
                    <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">{sub.backPoints || '—'}</td>
                    <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">{sub.bicepsPoints || '—'}</td>
                    <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">{sub.tricepsPoints || '—'}</td>
                    <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">{sub.legsPoints || '—'}</td>
                    <td className="px-3 py-2 text-right text-gray-500 dark:text-gray-500 hidden sm:table-cell">{sub.sets.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <AdminSubmissionModal submission={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
