export type ExerciseCategory = 'core' | 'chest' | 'back' | 'biceps' | 'triceps' | 'legs';
export type PointsFormula = 'standard' | 'pullup';

export interface ExerciseSet {
  id: string;
  category: ExerciseCategory;
  exerciseType: string;
  reps: number;
  weightLeft: number;
  weightRight: number;
  isTwoDumbbell: boolean;
}

export interface ExerciseCategoryConfig {
  label: string;
  emoji: string;
  types: readonly string[];
  pointsFormula: PointsFormula;
  isTwoDumbbell: boolean;
  fixedWeight?: number;        // if set, weight input is hidden and locked
  fixedWeightTypes?: Record<string, number>; // specific types with fixed weights (e.g. Coupon Curl)
  weightToggle?: boolean;      // if true, PAX can toggle between 1 and 2 DBs
  description: string;
}

export interface DailySubmission {
  paxName: string;
  homeAO: string;
  date: string;
  sets: ExerciseSet[];
  totalPoints: number;
  submittedAt: string;
}

export interface SheetsRow {
  timestamp: string;
  date: string;
  paxName: string;
  homeAO: string;
  totalPoints: number;
  corePoints: number;
  chestPoints: number;
  backPoints: number;
  bicepsPoints: number;
  tricepsPoints: number;
  legsPoints: number;
  rawSetsJson: string;
  hasBeatdown: boolean;
}

export interface LeaderboardEntry {
  paxName: string;
  homeAO: string;
  totalPoints: number;
  corePoints: number;
  chestPoints: number;
  backPoints: number;
  bicepsPoints: number;
  tricepsPoints: number;
  legsPoints: number;
  submissionCount: number;
}

export interface AOEntry {
  ao: string;
  totalPoints: number;
  paxCount: number;
}

export interface AOPaxEntry {
  paxName: string;
  totalPoints: number;
  corePoints: number;
  chestPoints: number;
  backPoints: number;
  bicepsPoints: number;
  tricepsPoints: number;
  legsPoints: number;
  submissionCount: number;
}

export interface PaxSubmission {
  date: string;
  totalPoints: number;
  corePoints: number;
  chestPoints: number;
  backPoints: number;
  bicepsPoints: number;
  tricepsPoints: number;
  legsPoints: number;
}

export interface AdminSubmission {
  timestamp: string;
  date: string;
  paxName: string;
  homeAO: string;
  totalPoints: number;
  corePoints: number;
  chestPoints: number;
  backPoints: number;
  bicepsPoints: number;
  tricepsPoints: number;
  legsPoints: number;
  sets: ExerciseSet[];
  hasBeatdown?: boolean;
}
