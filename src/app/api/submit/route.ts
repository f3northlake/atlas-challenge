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

    const { paxName, homeAO, date, sets, hasBeatdown } = parsed.data;
    const multiplier = hasBeatdown ? 2 : 1;

    // Re-compute all points server-side — never trust client-computed values
    const scoredSets: ExerciseSet[] = sets.map((set) => ({
      id: set.id,
      category: set.category,
      exerciseType: set.exerciseType,
      reps: set.reps,
      weightLeft: set.weightLeft,
      weightRight: set.weightRight,
      isTwoDumbbell: set.isTwoDumbbell,
    }));

    const totalPoints = scoredSets.reduce((sum, set) => {
      return sum + scoreSet(
        set.reps,
        set.weightLeft,
        set.weightRight,
        set.isTwoDumbbell,
        EXERCISES[set.category].pointsFormula,
        multiplier
      );
    }, 0);

    const now = new Date();

    const row: SheetsRow = {
      timestamp: now.toISOString(),
      date,
      paxName,
      homeAO,
      totalPoints,
      corePoints: categoryPoints(scoredSets, 'core', multiplier),
      chestPoints: categoryPoints(scoredSets, 'chest', multiplier),
      backPoints: categoryPoints(scoredSets, 'back', multiplier),
      bicepsPoints: categoryPoints(scoredSets, 'biceps', multiplier),
      tricepsPoints: categoryPoints(scoredSets, 'triceps', multiplier),
      legsPoints: categoryPoints(scoredSets, 'legs', multiplier),
      rawSetsJson: JSON.stringify(scoredSets),
      hasBeatdown: hasBeatdown ?? false,
    };

    await appendSubmissionRow(row);

    return NextResponse.json({ success: true, totalPoints });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
  }
}
