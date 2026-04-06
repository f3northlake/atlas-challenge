import { z } from 'zod';

// Categories where no weight is entered (pullup) or weight is fixed by the rules (core kewpon)
const NO_MIN_WEIGHT_CATEGORIES = new Set(['back', 'core']);

export const ExerciseSetSchema = z
  .object({
    id: z.string().min(1),
    category: z.enum(['core', 'chest', 'back', 'biceps', 'triceps', 'legs']),
    exerciseType: z.string().min(1, 'Exercise type is required'),
    reps: z.number().int('Reps must be a whole number').min(1, 'Reps must be at least 1').max(10000),
    weightLeft: z.number().min(0).max(2000),
    weightRight: z.number().min(0).max(2000),
    isTwoDumbbell: z.boolean(),
  })
  .superRefine((set, ctx) => {
    if (NO_MIN_WEIGHT_CATEGORIES.has(set.category)) return;
    if (set.weightLeft < 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 30,
        type: 'number',
        inclusive: true,
        message: 'Minimum weight is 30 lbs',
        path: ['weightLeft'],
      });
    }
    if (set.isTwoDumbbell && set.weightRight < 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 30,
        type: 'number',
        inclusive: true,
        message: 'Minimum weight is 30 lbs',
        path: ['weightRight'],
      });
    }
  });

export const SubmissionSchema = z.object({
  paxName: z.string().min(1, 'PAX name is required').max(100),
  homeAO: z.string().min(1, 'Home AO is required').max(100),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  sets: z
    .array(ExerciseSetSchema)
    .min(1, 'At least one exercise set is required')
    .max(200, 'Too many sets'),
  hasBeatdown: z.boolean().optional().default(false),
});

export type SubmissionInput = z.infer<typeof SubmissionSchema>;
