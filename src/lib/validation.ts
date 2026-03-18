import { z } from 'zod';

export const ExerciseSetSchema = z.object({
  id: z.string().min(1),
  category: z.enum(['core', 'chest', 'back', 'biceps', 'triceps', 'legs']),
  exerciseType: z.string().min(1, 'Exercise type is required'),
  reps: z.number().int('Reps must be a whole number').min(1, 'Reps must be at least 1').max(10000),
  weightLeft: z.number().min(0).max(2000),
  weightRight: z.number().min(0).max(2000),
  isTwoDumbbell: z.boolean(),
  points: z.number(), // client-computed; server re-validates and overwrites
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
});

export type SubmissionInput = z.infer<typeof SubmissionSchema>;
