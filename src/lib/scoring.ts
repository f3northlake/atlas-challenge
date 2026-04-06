import type { ExerciseCategory, ExerciseSet, PointsFormula } from '@/types/challenge';
import { EXERCISES } from '@/lib/constants';

/**
 * Points per rep at a given weight using standard formula:
 *   pts = max(1, 1 + floor((weight - 30) / 10))
 *
 * Examples:
 *   30 lbs → 1 pt
 *   35 lbs → 1 pt  (floor((35-30)/10) = 0)
 *   40 lbs → 2 pts
 *   45 lbs → 2 pts  (floor((45-30)/10) = 1)
 *   50 lbs → 3 pts
 */
export function ptsPerRep(weightLbs: number): number {
  return Math.max(1, 1 + Math.floor((weightLbs - 30) / 10));
}

/**
 * Score a single set.
 *
 * @param reps          Number of reps
 * @param weightLeft    Weight of left dumbbell (or single weight) in lbs
 * @param weightRight   Weight of right dumbbell in lbs (ignored if !isTwoDumbbell)
 * @param isTwoDumbbell Whether both dumbbells are used (scored independently)
 * @param formula       'standard' or 'pullup' (2 pts/rep flat)
 * @param multiplier    1 for normal, 2 for beatdown day
 */
export function scoreSet(
  reps: number,
  weightLeft: number,
  weightRight: number,
  isTwoDumbbell: boolean,
  formula: PointsFormula,
  multiplier = 1
): number {
  if (reps <= 0) return 0;

  let base: number;
  if (formula === 'pullup') {
    base = reps * 2;
  } else if (isTwoDumbbell) {
    base = reps * (ptsPerRep(weightLeft) + ptsPerRep(weightRight));
  } else {
    base = reps * ptsPerRep(weightLeft);
  }

  return base * multiplier;
}

/**
 * Score an array of sets.
 * @param multiplier  Apply this multiplier to every set (1 = normal, 2 = beatdown day)
 */
export function scoreSets(sets: ExerciseSet[], multiplier = 1): number {
  return sets.reduce((total, set) => {
    const formula = EXERCISES[set.category].pointsFormula;
    return total + scoreSet(set.reps, set.weightLeft, set.weightRight, set.isTwoDumbbell, formula, multiplier);
  }, 0);
}

/**
 * Sum points for a specific category.
 * @param multiplier  Apply this multiplier to every set (1 = normal, 2 = beatdown day)
 */
export function categoryPoints(sets: ExerciseSet[], category: ExerciseCategory, multiplier = 1): number {
  return scoreSets(sets.filter((s) => s.category === category), multiplier);
}

/** Re-score a set in place (returns new points value). */
export function rescore(set: ExerciseSet): number {
  const formula = EXERCISES[set.category].pointsFormula;
  return scoreSet(set.reps, set.weightLeft, set.weightRight, set.isTwoDumbbell, formula);
}
