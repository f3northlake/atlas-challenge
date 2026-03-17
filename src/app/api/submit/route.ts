import { NextRequest, NextResponse } from 'next/server';
import { SubmissionSchema } from '@/lib/validation';
import { appendSubmissionRow } from '@/lib/sheets';
import { scoreSet, categoryPoints } from '@/lib/scoring';
import { EXERCISES } from '@/lib/constants';
import type { ExerciseSet, SheetsRow } from '@/types/challenge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = SubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { paxName, homeAO, date, sets } = parsed.data;

    // Re-compute all points server-side — never trust client-computed values
    const scoredSets: ExerciseSet[] = sets.map((set) => ({
      ...set,
      points: scoreSet(
        set.reps,
        set.weightLeft,
        set.weightRight,
        set.isTwoDumbbell,
        EXERCISES[set.category].pointsFormula
      ),
    }));

    const totalPoints = scoredSets.reduce((sum, s) => sum + s.points, 0);
    const now = new Date();

    const row: SheetsRow = {
      timestamp: now.toISOString(),
      date,
      paxName,
      homeAO,
      totalPoints,
      corePoints: categoryPoints(scoredSets, 'core'),
      chestPoints: categoryPoints(scoredSets, 'chest'),
      backPoints: categoryPoints(scoredSets, 'back'),
      bicepsPoints: categoryPoints(scoredSets, 'biceps'),
      tricepsPoints: categoryPoints(scoredSets, 'triceps'),
      rawSetsJson: JSON.stringify(scoredSets),
    };

    await appendSubmissionRow(row);

    return NextResponse.json({ success: true, totalPoints });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
  }
}
