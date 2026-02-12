import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  DocumentData,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { User } from "@/types/user";

// ─── User Profile ─────────────────────────────────────

export async function updateUserProfile(
  userId: string,
  data: Partial<User>
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data as DocumentData);
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return null;
  return { uid: userId, ...snap.data() } as User;
}

// ─── Initial PRs (Onboarding) ────────────────────────

export async function saveInitialPRs(
  userId: string,
  prs: { squat: number; bench: number; deadlift: number }
): Promise<void> {
  const liftsRef = collection(db, "users", userId, "lifts");
  const exercises = ["squat", "bench", "deadlift"] as const;

  for (const exercise of exercises) {
    const weight = prs[exercise];
    if (weight > 0) {
      await addDoc(liftsRef, {
        userId,
        exercise,
        weight,
        reps: 1,
        estimatedMax: weight,
        date: serverTimestamp(),
        notes: "PR initial (onboarding)",
      });
    }
  }
}

// ─── Onboarding ───────────────────────────────────────

export async function completeOnboarding(
  userId: string,
  profileData: {
    gender: "male" | "female";
    bodyweight: number;
    experience: "beginner" | "intermediate" | "advanced" | "elite";
    programSettings?: {
      daysPerWeek: 3 | 4 | 5;
      durationWeeks: 4 | 6;
      priorityLift: "squat" | "bench" | "deadlift";
      programType: "531" | "linear";
    };
  },
  prs: { squat: number; bench: number; deadlift: number }
): Promise<void> {
  await updateUserProfile(userId, {
    ...profileData,
    onboardingCompleted: true,
  });
  await saveInitialPRs(userId, prs);
}
