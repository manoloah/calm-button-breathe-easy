
import { z } from "zod";

// Define Zod schemas for database types
export const BreathingGoalSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  displayName: z.string(),
  description: z.string().nullable(),
});

export const BreathingStepSchema = z.object({
  id: z.string().uuid(),
  inhaleMethod: z.string(),
  inhaleSeconds: z.number(),
  holdInSeconds: z.number(),
  exhaleMethod: z.string(),
  exhaleSeconds: z.number(),
  holdOutSeconds: z.number(),
  cueText: z.string().nullable(),
});

export const BreathingPatternSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  goalId: z.string().uuid().nullable(),
  recommendedMinutes: z.number().nullable(),
  cycleSeconds: z.number().nullable(),
  createdAt: z.string().nullable(),
});

export const PatternStepSchema = z.object({
  patternId: z.string().uuid(),
  stepId: z.string().uuid().nullable(),
  position: z.number(),
  repetitions: z.number().nullable().default(1),
  step: BreathingStepSchema.optional(),
});

// Export TypeScript types derived from Zod schemas
export type BreathingGoal = z.infer<typeof BreathingGoalSchema>;
export type BreathingStep = z.infer<typeof BreathingStepSchema>;
export type BreathingPattern = z.infer<typeof BreathingPatternSchema>;
export type PatternStep = z.infer<typeof PatternStepSchema>;

// Expanded pattern with all steps included
export type ExpandedPattern = BreathingPattern & {
  steps: (PatternStep & { step: BreathingStep })[];
};
