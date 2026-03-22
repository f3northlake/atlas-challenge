'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import ExerciseSet from '@/components/ExerciseSet';
import { EXERCISES, DEFAULT_WEIGHT } from '@/lib/constants';
import type { ExerciseCategory as ExerciseCategoryType } from '@/types/challenge';
import type { FormValues } from '@/components/ChallengeForm';

const categoryFieldMap = {
  core: 'coreSets',
  chest: 'chestSets',
  back: 'backSets',
  biceps: 'bicepsSets',
  triceps: 'tricepsSets',
  legs: 'legsSets',
} as const;

const bdCategoryFieldMap = {
  core: 'bdCoreSets',
  chest: 'bdChestSets',
  back: 'bdBackSets',
  biceps: 'bdBicepsSets',
  triceps: 'bdTricepsSets',
  legs: 'bdLegsSets',
} as const;

interface ExerciseCategoryProps {
  category: ExerciseCategoryType;
  categoryPoints: number;
  isBeatdown?: boolean;
}

function makeNewSet(category: ExerciseCategoryType, multiplier = 1) {
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
    points: 0,
    multiplier,
  };
}

export default function ExerciseCategory({ category, categoryPoints, isBeatdown = false }: ExerciseCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = EXERCISES[category];
  const fieldArrayName = isBeatdown ? bdCategoryFieldMap[category] : categoryFieldMap[category];

  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName });

  const sets = useWatch({ control, name: fieldArrayName }) as unknown[];
  const setCount = sets?.length ?? 0;

  const headerClass = isBeatdown
    ? 'w-full flex items-center justify-between px-4 py-3 bg-f3navy hover:bg-f3navy/90 transition-colors'
    : 'w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';

  return (
    <div className={`mb-3 rounded-xl overflow-hidden shadow-sm border ${isBeatdown ? 'border-f3yellow' : 'border-gray-200 dark:border-gray-700'}`}>
      <button type="button" onClick={() => setIsOpen((o) => !o)} className={headerClass}>
        <div className="flex items-center gap-3 text-left">
          <span className="text-xl">{config.emoji}</span>
          <div>
            <p className={`font-bold text-sm ${isBeatdown ? 'text-white' : 'text-f3navy dark:text-gray-100'}`}>
              {config.label}
            </p>
            <p className={`text-xs ${isBeatdown ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {config.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {categoryPoints > 0 && (
            <span className="text-xs font-bold bg-f3yellow text-f3navy rounded px-2 py-0.5">
              {categoryPoints} pts
            </span>
          )}
          {setCount > 0 && (
            <span className={`text-xs ${isBeatdown ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {setCount} set{setCount !== 1 ? 's' : ''}
            </span>
          )}
          <span className={`text-lg ${isBeatdown ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="bg-gray-50 dark:bg-gray-900 px-4 pt-3 pb-4">
          {fields.map((field, index) => (
            <ExerciseSet
              key={field.id}
              category={category}
              fieldName={`${fieldArrayName}.${index}`}
              index={index}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
              isBeatdown={isBeatdown}
            />
          ))}

          <button
            type="button"
            onClick={() => append(makeNewSet(category, isBeatdown ? 2 : 1))}
            className="w-full mt-1 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-f3yellow hover:text-f3navy dark:hover:text-white transition-colors font-medium"
          >
            + Add Set
          </button>
        </div>
      )}
    </div>
  );
}
