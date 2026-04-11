import type { ExerciseCategory, ExerciseCategoryConfig } from '@/types/challenge';

// Update this list with actual F3 Northlake AO names before launch
export const AO_LIST = [
  'Dog Pound',
  'Eagles Nest',
  'Hacksaw',
  'Hurt Locker',
  'The Frontier',
  'The Brier Patch',
  'The Quad',
  'The Reaper',
  'The Sandlot',
  'Uncle Bills Porch',
] as const;

export const EXERCISES: Record<ExerciseCategory, ExerciseCategoryConfig> = {
  core: {
    label: 'Core',
    emoji: '💪',
    types: ['BBSU', 'WWII', 'WWIII'],
    pointsFormula: 'standard',
    isTwoDumbbell: false,
    fixedWeight: 30,
    description: 'BBSU (with kewpon), WWII, or WWIII — kewpon = 30 lbs (1 pt/rep)',
  },
  chest: {
    label: 'Chest — Bench Press',
    emoji: '🏋️',
    types: ['Dumbbell', 'Kettlebell'],
    pointsFormula: 'standard',
    isTwoDumbbell: true,
    description: 'Any bench variation (incline, flat, decline) — each dumbbell scored separately',
  },
  back: {
    label: 'Back — Pull Ups',
    emoji: '⬆️',
    types: ['Pull Up', 'Chin Up', 'Neutral Grip Pull Up'],
    pointsFormula: 'pullup',
    isTwoDumbbell: false,
    fixedWeight: 0,
    description: '2 pts per rep — no weight needed',
  },
  biceps: {
    label: 'Biceps — Curls',
    emoji: '💪',
    types: ['Coupon Curl', 'Standard Curl', 'Hammer Curl', 'Concentration Curl', 'Other'],
    pointsFormula: 'standard',
    isTwoDumbbell: false,
    weightToggle: true,
    fixedWeightTypes: { 'Coupon Curl': 30 },
    description: 'Any curl variation — toggle single or double dumbbell',
  },
  triceps: {
    label: 'Triceps — Extension',
    emoji: '🔱',
    types: ['Overhead Extension', 'Skull Crusher', 'Kickback', 'Other'],
    pointsFormula: 'standard',
    isTwoDumbbell: false,
    weightToggle: true,
    description: 'Any tricep extension — toggle single or double dumbbell',
  },
  legs: {
    label: 'Legs',
    emoji: '🦵',
    types: ['Goblet Squat', 'Lunge', 'Romanian Deadlift', 'Step Up', 'Bulgarian Split Squat', 'Other'],
    pointsFormula: 'standard',
    isTwoDumbbell: false,
    weightToggle: true,
    description: 'Any leg exercise — toggle single or double dumbbell',
  },
};

export const EXERCISE_CATEGORIES = Object.keys(EXERCISES) as ExerciseCategory[];

// Common dumbbell/weight increments in lbs
export const WEIGHT_OPTIONS = [
  10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
];

export const DEFAULT_WEIGHT = 30;
export const MIN_WEIGHT = 30;
export const WEIGHT_STEP = 5;
