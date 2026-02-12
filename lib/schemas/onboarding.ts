import { z } from "zod/v4";

export const onboardingSchema = z.object({
  // Step 1
  gender: z.enum(["male", "female"]),
  bodyweight: z.number().positive("Le poids doit être positif"),
  // Step 2
  experience: z.enum(["beginner", "intermediate", "advanced", "elite"]),
  // Step 3
  squat: z.number().positive("Le squat doit être positif"),
  bench: z.number().positive("Le bench doit être positif"),
  deadlift: z.number().positive("Le deadlift doit être positif"),
  // Step 4
  programType: z.enum(["531", "linear"]),
  durationWeeks: z.union([z.literal(4), z.literal(6)]),
  daysPerWeek: z.union([z.literal(3), z.literal(4), z.literal(5)]),
  priorityLift: z.enum(["squat", "bench", "deadlift"]),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Per-step field sets for partial validation
export const STEP_FIELDS = {
  1: ["gender", "bodyweight"],
  2: ["experience"],
  3: ["squat", "bench", "deadlift"],
  4: ["programType", "durationWeeks", "daysPerWeek", "priorityLift"],
} as const;
