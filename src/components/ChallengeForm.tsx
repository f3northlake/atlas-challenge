'use client';

import { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ExerciseCategoryCard from '@/components/ExerciseCategory';
import PointsPreview from '@/components/PointsPreview';
import { EXERCISES, AO_LIST, DEFAULT_WEIGHT } from '@/lib/constants';
import { scoreSets, categoryPoints } from '@/lib/scoring';
import type { ExerciseSet } from '@/types/challenge';

interface SetFormRow {
  id: string;
  category: string;
  exerciseType: string;
  reps: number;
  weightLeft: number;
  weightRight: number;
  isTwoDumbbell: boolean;
}

export interface FormValues {
  paxName: string;
  homeAO: string;
  date: string;
  coreSets: SetFormRow[];
  chestSets: SetFormRow[];
  backSets: SetFormRow[];
  bicepsSets: SetFormRow[];
  tricepsSets: SetFormRow[];
  legsSets: SetFormRow[];
}

function makeDefaultSet(category: keyof typeof EXERCISES): SetFormRow {
  const config = EXERCISES[category];
  const defaultWeight = config.fixedWeight !== undefined ? config.fixedWeight : DEFAULT_WEIGHT;
  return {
    id: crypto.randomUUID(),
    category,
    exerciseType: config.types[0],
    reps: 0,
    weightLeft: defaultWeight,
    weightRight: defaultWeight,
    isTwoDumbbell: config.isTwoDumbbell,
  };
}

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

const CATEGORIES = ['core', 'chest', 'back', 'biceps', 'triceps', 'legs'] as const;

export default function ChallengeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasBeatdown, setHasBeatdown] = useState(false);

  const methods = useForm<FormValues>({
    defaultValues: {
      paxName: '',
      homeAO: '',
      date: todayString(),
      coreSets:    [makeDefaultSet('core')],
      chestSets:   [makeDefaultSet('chest')],
      backSets:    [makeDefaultSet('back')],
      bicepsSets:  [makeDefaultSet('biceps')],
      tricepsSets: [makeDefaultSet('triceps')],
      legsSets:    [makeDefaultSet('legs')],
    },
  });

  const { register, handleSubmit, control, formState: { errors } } = methods;

  const coreSets    = useWatch({ control, name: 'coreSets' }) as ExerciseSet[];
  const chestSets   = useWatch({ control, name: 'chestSets' }) as ExerciseSet[];
  const backSets    = useWatch({ control, name: 'backSets' }) as ExerciseSet[];
  const bicepsSets  = useWatch({ control, name: 'bicepsSets' }) as ExerciseSet[];
  const tricepsSets = useWatch({ control, name: 'tricepsSets' }) as ExerciseSet[];
  const legsSets    = useWatch({ control, name: 'legsSets' }) as ExerciseSet[];

  const allSets = [...coreSets, ...chestSets, ...backSets, ...bicepsSets, ...tricepsSets, ...legsSets];
  const effectiveMultiplier = hasBeatdown ? 2 : 1;

  const corePoints    = categoryPoints(allSets, 'core', effectiveMultiplier);
  const chestPoints   = categoryPoints(allSets, 'chest', effectiveMultiplier);
  const backPoints    = categoryPoints(allSets, 'back', effectiveMultiplier);
  const bicepsPoints  = categoryPoints(allSets, 'biceps', effectiveMultiplier);
  const tricepsPoints = categoryPoints(allSets, 'triceps', effectiveMultiplier);
  const legsPoints    = categoryPoints(allSets, 'legs', effectiveMultiplier);

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    const formSets = [
      ...data.coreSets, ...data.chestSets, ...data.backSets,
      ...data.bicepsSets, ...data.tricepsSets, ...data.legsSets,
    ].filter((s) => s.reps > 0);

    if (formSets.length === 0) {
      setSubmitError('Please enter at least one set with reps before submitting.');
      setIsSubmitting(false);
      return;
    }

    const total = scoreSets(formSets as ExerciseSet[], effectiveMultiplier);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paxName: data.paxName,
          homeAO: data.homeAO,
          date: data.date,
          sets: formSets,
          hasBeatdown,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Submission failed');
      }

      const json = await res.json();
      router.push(`/success?points=${json.totalPoints ?? total}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="pb-28">
        {/* PAX Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-4">
          <h2 className="font-bold text-f3navy dark:text-gray-100 text-sm uppercase tracking-wide mb-3">Your Info</h2>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              F3 Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('paxName', { required: 'F3 name is required' })}
              type="text"
              placeholder="e.g. Hammerhead"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-f3yellow"
            />
            {errors.paxName && <p className="text-red-500 text-xs mt-1">{errors.paxName.message}</p>}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Home AO <span className="text-red-500">*</span>
            </label>
            <select
              {...register('homeAO', { required: 'Home AO is required' })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-f3yellow"
            >
              <option value="">Select your AO...</option>
              {AO_LIST.map((ao) => (
                <option key={ao} value={ao}>{ao}</option>
              ))}
            </select>
            {errors.homeAO && <p className="text-red-500 text-xs mt-1">{errors.homeAO.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-f3yellow"
            />
          </div>
        </div>

        {/* Beatdown toggle */}
        <div className="bg-f3navy rounded-xl p-4 mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-black text-white text-sm">Did you do a Beatdown today?</p>
            <p className="text-gray-400 text-xs mt-0.5">All your reps today earn 2× points</p>
          </div>
          <button
            type="button"
            onClick={() => setHasBeatdown((v) => !v)}
            className={`shrink-0 px-5 py-2 rounded-lg font-black text-sm transition-colors ${
              hasBeatdown
                ? 'bg-f3yellow text-f3navy'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {hasBeatdown ? 'YES' : 'NO'}
          </button>
        </div>

        {/* Scoring reminder */}
        <div className="bg-f3yellow/10 dark:bg-f3yellow/5 border border-f3yellow dark:border-f3yellow/50 rounded-xl p-3 mb-4 text-xs text-gray-700 dark:text-gray-300">
          <p className="font-bold text-f3navy dark:text-f3yellow mb-1">Scoring Reminder</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>30 lbs = 1 pt/rep &nbsp;|&nbsp; 40 lbs = 2 pts &nbsp;|&nbsp; 50 lbs = 3 pts</li>
            <li>Two-dumbbell exercises: each DB scored separately per rep</li>
            <li>Pull ups: 2 pts/rep flat</li>
            <li>Beatdown days: toggle YES above and all reps count 2×</li>
          </ul>
        </div>

        {/* Exercise cards */}
        <h2 className="font-bold text-f3navy dark:text-gray-100 text-sm uppercase tracking-wide mb-2">
          Log Your Reps
        </h2>
        {CATEGORIES.map((cat) => (
          <ExerciseCategoryCard
            key={cat}
            category={cat}
            categoryPoints={categoryPoints(allSets, cat, effectiveMultiplier)}
            hasBeatdown={hasBeatdown}
          />
        ))}

        {/* Submit */}
        {submitError && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-3 text-sm text-red-700 dark:text-red-400">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-f3yellow text-f3navy font-bold py-4 rounded-xl text-base hover:bg-yellow-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Daily Points'}
        </button>
      </form>

      <PointsPreview
        core={corePoints}
        chest={chestPoints}
        back={backPoints}
        biceps={bicepsPoints}
        triceps={tricepsPoints}
        legs={legsPoints}
      />
    </FormProvider>
  );
}
