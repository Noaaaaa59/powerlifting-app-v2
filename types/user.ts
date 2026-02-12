export type WeightUnit = "kg" | "lbs";

export type ThemeColor = "rouge" | "neutre" | "forest" | "rose" | "ocean" | "sunset";
export type ThemeMode = "light" | "dark" | "auto";

export type Gender = "male" | "female";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "elite";

export type MaleWeightCategory = 59 | 66 | 74 | 83 | 93 | 105 | 120 | 121;
export type FemaleWeightCategory = 47 | 52 | 57 | 63 | 69 | 76 | 84 | 85;
export type WeightCategory = MaleWeightCategory | FemaleWeightCategory;

export interface UserPreferences {
  weightUnit: WeightUnit;
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  restTimerDefault: number;
}

export interface ProgramSettings {
  daysPerWeek: 3 | 4 | 5;
  durationWeeks: 4 | 6;
  priorityLift: "squat" | "bench" | "deadlift" | null;
  trainingMaxPercentage: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date;
  preferences: UserPreferences;
  bodyweight: number | null;
  gender: Gender | null;
  experience: ExperienceLevel | null;
  friends: string[];
  onboardingCompleted: boolean;
  programProgress: {
    currentWeek: number;
    currentDay: number;
  } | null;
  programSettings: ProgramSettings | null;
}
