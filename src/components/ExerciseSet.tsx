'use client';

import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { scoreSet } from '@/lib/scoring';
import { EXERCISES, WEIGHT_STEP, MIN_WEIGHT } from '@/lib/constants';
import type { ExerciseCategory } from '@/types/challenge';
import type { FormValues } from '@/components/ChallengeForm';

interface ExerciseSetProps {
  category: ExerciseCategory;
  fieldName: `${string}Sets.${number}`;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  isBeatdown?: boolean;
}

const categoryFieldMap: Record<ExerciseCategory, keyof FormValues> = {
  core: 'coreSets',
  chest: 'chestSets',
  back: 'backSets',
  biceps: 'bicepsSets',
  triceps: 'tricepsSets',
  legs: 'legsSets',
};

const bdCategoryFieldMap: Record<ExerciseCategory, keyof FormValues> = {
  core: 'bdCoreSets',
  chest: 'bdChestSets',
  back: 'bdBackSets',
  biceps: 'bdBicepsSets',
  triceps: 'bdTricepsSets',
  legs: 'bdLegsSets',
};

export default function ExerciseSet({ category, index, onRemove, canRemove, isBeatdown = false }: ExerciseSetProps) {
  const config = EXERCISES[category];
  const fieldBase = `${isBeatdown ? bdCategoryFieldMap[category] : categoryFieldMap[category]}.${index}` as const;

  const { register, setValue, control } = useFormContext<FormValues>();

  const reps = useWatch({ control, name: `${fieldBase}.reps` as never }) as number;
  const weightLeft = useWatch({ control, name: `${fieldBase}.weightLeft` as never }) as number;
  const weightRight = useWatch({ control, name: `${fieldBase}.weightRight` as never }) as number;
  const isTwoDumbbell = (useWatch({ control, name: `${fieldBase}.isTwoDumbbell` as never }) as unknown) as boolean;
  const exerciseType = useWatch({ control, name: `${fieldBase}.exerciseType` as never }) as string;
  const multiplier = (useWatch({ control, name: `${fieldBase}.multiplier` as never }) as number) ?? 1;

  const livePoints = scoreSet(
    Number(reps) || 0,
    Number(weightLeft) || 0,
    Number(weightRight) || 0,
    isTwoDumbbell,
    config.pointsFormula,
    Number(multiplier) || 1
  );

  useEffect(() => {
    setValue(`${fieldBase}.points` as never, livePoints as never);
  }, [livePoints, fieldBase, setValue]);

  const isPullup = config.pointsFormula === 'pullup';
  const isFixedWeight = config.fixedWeight !== undefined;

  function adjustWeight(side: 'left' | 'right', delta: number) {
    const field = side === 'left' ? `${fieldBase}.weightLeft` : `${fieldBase}.weightRight`;
    const current = side === 'left' ? Number(weightLeft) : Number(weightRight);
    const next = Math.max(MIN_WEIGHT, current + delta);
    setValue(field as never, next as never);

    if (!isTwoDumbbell && side === 'left') {
      setValue(`${fieldBase}.weightRight` as never, next as never);
    }
  }

  function handleToggleTwoDb(checked: boolean) {
    setValue(`${fieldBase}.isTwoDumbbell` as never, checked as never);
    if (!checked) {
      setValue(`${fieldBase}.weightRight` as never, weightLeft as never);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-2">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Set {index + 1}</span>
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm rounded px-2 py-0.5 ${multiplier === 2 ? 'bg-f3yellow text-f3navy' : 'text-f3yellow bg-f3navy'}`}>
            {livePoints} pts{multiplier === 2 ? ' ×2' : ''}
          </span>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-red-400 hover:text-red-600 text-lg leading-none font-bold"
              aria-label="Remove set"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Exercise type selector */}
      <div className="mb-2">
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Exercise</label>
        <select
          {...register(`${fieldBase}.exerciseType` as never)}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-f3yellow"
        >
          {config.types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input type="hidden" value={exerciseType} readOnly />
      </div>

      {/* Reps input */}
      <div className="mb-2">
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">Reps</label>
        <input
          {...register(`${fieldBase}.reps` as never, { valueAsNumber: true })}
          type="text"
          inputMode="numeric"
          placeholder="0"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-f3yellow"
        />
      </div>

      {/* Weight inputs */}
      {!isPullup && !isFixedWeight && (
        <>
          {config.weightToggle && (
            <div className="flex items-center gap-2 mb-2">
              <input
                id={`${fieldBase}-two-db`}
                type="checkbox"
                checked={isTwoDumbbell}
                onChange={(e) => handleToggleTwoDb(e.target.checked)}
                className="accent-f3yellow"
              />
              <label htmlFor={`${fieldBase}-two-db`} className="text-xs text-gray-600 dark:text-gray-400">
                Two dumbbells
              </label>
            </div>
          )}

          <div className={`grid gap-2 ${isTwoDumbbell ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <WeightInput
              label={isTwoDumbbell ? 'Left DB (lbs)' : 'Weight (lbs)'}
              value={Number(weightLeft) || 0}
              onAdjust={(delta) => adjustWeight('left', delta)}
              fieldName={`${fieldBase}.weightLeft` as never}
              register={register}
              onChange={(val) => {
                setValue(`${fieldBase}.weightLeft` as never, val as never);
                if (!isTwoDumbbell) {
                  setValue(`${fieldBase}.weightRight` as never, val as never);
                }
              }}
            />
            {isTwoDumbbell && (
              <WeightInput
                label="Right DB (lbs)"
                value={Number(weightRight) || 0}
                onAdjust={(delta) => adjustWeight('right', delta)}
                fieldName={`${fieldBase}.weightRight` as never}
                register={register}
                onChange={(val) => setValue(`${fieldBase}.weightRight` as never, val as never)}
              />
            )}
          </div>
        </>
      )}

      {isFixedWeight && config.fixedWeight! > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Kewpon = 30 lbs (1 pt/rep)</p>
      )}

      {isPullup && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 pts per rep — no weight needed</p>
      )}
    </div>
  );
}

interface WeightInputProps {
  label: string;
  value: number;
  onAdjust: (delta: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldName: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  onChange: (val: number) => void;
}

function WeightInput({ label, value, onAdjust, fieldName, register, onChange }: WeightInputProps) {
  return (
    <div>
      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onAdjust(-WEIGHT_STEP)}
          className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-base leading-none"
        >
          −
        </button>
        <input
          {...register(fieldName, { valueAsNumber: true })}
          type="text"
          inputMode="numeric"
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            onChange(isNaN(parsed) ? MIN_WEIGHT : Math.max(MIN_WEIGHT, parsed));
          }}
          placeholder="30"
          className="flex-1 text-center border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-f3yellow"
        />
        <button
          type="button"
          onClick={() => onAdjust(WEIGHT_STEP)}
          className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-base leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
