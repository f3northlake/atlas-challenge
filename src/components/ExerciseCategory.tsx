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
} as const;

interface ExerciseCategoryProps {
  category: ExerciseCategoryType;
  categoryPoints: number;
}

function makeNewSet(category: ExerciseCategoryType) {
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
  };
}

export default function ExerciseCategory({ category, categoryPoints }: ExerciseCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = EXERCISES[category];
  const fieldArrayName = categoryFieldMap[category];

  const { control } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName });

  // Watch all sets to show live count
  const sets = useWatch({ control, name: fieldArrayName }) as unknown[];
  const setCount = sets?.length ?? 0;

  return (
    <div className="mb-3 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Category header / toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-xl">{config.emoji}</span>
          <div>
            <p className="font-bold text-f3navy text-sm">{config.label}</p>
            <p className="text-xs text-gray-400">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {categoryPoints > 0 && (
            <span className="text-xs font-bold bg-f3yellow text-f3navy rounded px-2 py-0.5">
              {categoryPoints} pts
            </span>
          )}
          {setCount > 0 && (
            <span className="text-xs text-gray-400">{setCount} set{setCount !== 1 ? 's' : ''}</span>
          )}
          <span className="text-gray-400 text-lg">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="bg-gray-50 px-4 pt-3 pb-4">
          {fields.map((field, index) => (
            <ExerciseSet
              key={field.id}
              category={category}
              fieldName={`${fieldArrayName}.${index}`}
              index={index}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}

          <button
            type="button"
            onClick={() => append(makeNewSet(category))}
            className="w-full mt-1 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-f3yellow hover:text-f3navy transition-colors font-medium"
          >
            + Add Set
          </button>
        </div>
      )}
    </div>
  );
}
