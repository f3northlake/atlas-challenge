'use client';

import type { LeaderboardEntry, AOEntry } from '@/types/challenge';

interface LeaderboardTableProps {
  individuals: LeaderboardEntry[];
  aos: AOEntry[];
}

export default function LeaderboardTable({ individuals, aos }: LeaderboardTableProps) {
  return (
    <div className="space-y-6">
      {/* AO Standings */}
      {aos.length > 0 && (
        <section>
          <h2 className="text-f3navy font-bold text-sm uppercase tracking-wide mb-2">
            AO Standings — Golden Shovel Race
          </h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-f3navy text-white">
                <tr>
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-left px-3 py-2">AO</th>
                  <th className="text-right px-3 py-2">PAX</th>
                  <th className="text-right px-3 py-2">Pts</th>
                </tr>
              </thead>
              <tbody>
                {aos.map((ao, i) => (
                  <tr key={ao.ao} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-gray-500 font-medium">{i + 1}</td>
                    <td className="px-3 py-2 font-semibold text-f3navy">{ao.ao}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{ao.paxCount}</td>
                    <td className="px-3 py-2 text-right font-bold text-f3yellow bg-f3navy rounded-sm">
                      {ao.totalPoints.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Individual Standings */}
      <section>
        <h2 className="text-f3navy font-bold text-sm uppercase tracking-wide mb-2">
          Individual Standings
        </h2>
        {individuals.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No submissions yet — be the first!
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="bg-f3navy text-white">
                  <tr>
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-left px-3 py-2">PAX</th>
                    <th className="text-left px-3 py-2 hidden sm:table-cell">AO</th>
                    <th className="text-right px-3 py-2">Total</th>
                    <th className="text-right px-3 py-2 hidden md:table-cell">Core</th>
                    <th className="text-right px-3 py-2 hidden md:table-cell">Chest</th>
                    <th className="text-right px-3 py-2 hidden md:table-cell">Back</th>
                    <th className="text-right px-3 py-2 hidden md:table-cell">Bis</th>
                    <th className="text-right px-3 py-2 hidden md:table-cell">Tris</th>
                  </tr>
                </thead>
                <tbody>
                  {individuals.map((entry, i) => (
                    <tr key={entry.paxName} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-gray-500 font-medium">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </td>
                      <td className="px-3 py-2 font-semibold text-f3navy">{entry.paxName}</td>
                      <td className="px-3 py-2 text-gray-500 hidden sm:table-cell">{entry.homeAO}</td>
                      <td className="px-3 py-2 text-right font-bold text-f3navy">
                        {entry.totalPoints.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500 hidden md:table-cell">{entry.corePoints}</td>
                      <td className="px-3 py-2 text-right text-gray-500 hidden md:table-cell">{entry.chestPoints}</td>
                      <td className="px-3 py-2 text-right text-gray-500 hidden md:table-cell">{entry.backPoints}</td>
                      <td className="px-3 py-2 text-right text-gray-500 hidden md:table-cell">{entry.bicepsPoints}</td>
                      <td className="px-3 py-2 text-right text-gray-500 hidden md:table-cell">{entry.tricepsPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
