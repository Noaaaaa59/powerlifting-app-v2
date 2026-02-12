"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { completeOnboarding } from "@/lib/firebase/firestore";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  onboardingSchema,
  type OnboardingFormData,
  STEP_FIELDS,
} from "@/lib/schemas/onboarding";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

type Step = 1 | 2 | 3 | 4;

const experienceOptions = [
  { value: "beginner" as const, label: "Débutant", description: "Moins de 1 an de pratique" },
  { value: "intermediate" as const, label: "Intermédiaire", description: "1-3 ans de pratique" },
  { value: "advanced" as const, label: "Avancé", description: "3-5 ans de pratique" },
  { value: "elite" as const, label: "Elite", description: "+5 ans, niveau compétition" },
];

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    setValue,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      programType: "531",
      durationWeeks: 4,
      daysPerWeek: 3,
      priorityLift: "squat",
    },
  });

  const gender = watch("gender");
  const experience = watch("experience");
  const programType = watch("programType");
  const daysPerWeek = watch("daysPerWeek");
  const durationWeeks = watch("durationWeeks");
  const priorityLift = watch("priorityLift");

  const handleNext = async () => {
    const fields = STEP_FIELDS[step] as readonly (keyof OnboardingFormData)[];
    const valid = await trigger([...fields]);
    if (valid && step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      await completeOnboarding(
        user.uid,
        {
          gender: data.gender,
          bodyweight: data.bodyweight,
          experience: data.experience,
          programSettings: {
            daysPerWeek: data.programType === "linear" ? 3 : data.daysPerWeek,
            durationWeeks: data.durationWeeks,
            priorityLift: data.priorityLift,
            programType: data.programType,
          },
        },
        {
          squat: data.squat,
          bench: data.bench,
          deadlift: data.deadlift,
        }
      );
      onComplete();
    } catch {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} modal>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Bienvenue sur NextPR</DialogTitle>
          <DialogDescription>
            Configurons ton profil pour personnaliser ton expérience
          </DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 my-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s === step
                  ? "bg-primary"
                  : s < step
                    ? "bg-primary/50"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Gender + Bodyweight */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Genre</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["male", "female"] as const).map((g) => (
                    <Card
                      key={g}
                      className={`cursor-pointer transition-all ${
                        gender === g
                          ? "border-primary ring-2 ring-primary/20"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setValue("gender", g, { shouldValidate: true })}
                    >
                      <CardContent className="p-4 text-center">
                        <span className="text-2xl">{g === "male" ? "♂" : "♀"}</span>
                        <p className="mt-1 font-medium">
                          {g === "male" ? "Homme" : "Femme"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyweight">Poids corporel (kg)</Label>
                <Input
                  id="bodyweight"
                  type="number"
                  placeholder="75"
                  {...register("bodyweight", { valueAsNumber: true })}
                />
                {errors.bodyweight && (
                  <p className="text-sm text-destructive">{errors.bodyweight.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="space-y-3">
              <Label>Niveau d&apos;expérience</Label>
              <div className="grid gap-2">
                {experienceOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      experience === option.value
                        ? "border-primary ring-2 ring-primary/20"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setValue("experience", option.value, { shouldValidate: true })
                    }
                  >
                    <CardContent className="p-3">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.experience && (
                <p className="text-sm text-destructive">{errors.experience.message}</p>
              )}
            </div>
          )}

          {/* Step 3: PRs */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Entre tes meilleurs performances actuelles (1RM ou estimés)
              </p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="squat">Squat (kg)</Label>
                  <Input
                    id="squat"
                    type="number"
                    placeholder="100"
                    {...register("squat", { valueAsNumber: true })}
                  />
                  {errors.squat && (
                    <p className="text-sm text-destructive">{errors.squat.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bench">Bench Press (kg)</Label>
                  <Input
                    id="bench"
                    type="number"
                    placeholder="80"
                    {...register("bench", { valueAsNumber: true })}
                  />
                  {errors.bench && (
                    <p className="text-sm text-destructive">{errors.bench.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadlift">Deadlift (kg)</Label>
                  <Input
                    id="deadlift"
                    type="number"
                    placeholder="120"
                    {...register("deadlift", { valueAsNumber: true })}
                  />
                  {errors.deadlift && (
                    <p className="text-sm text-destructive">{errors.deadlift.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Program config */}
          {step === 4 && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Configure ton programme d&apos;entraînement
              </p>

              {/* Program type */}
              <div className="space-y-3">
                <Label>Méthode d&apos;entraînement</Label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: "531" as const, label: "5/3/1", desc: "Wendler - Progression ondulatoire" },
                    { value: "linear" as const, label: "Linéaire", desc: "Heavy / Medium / Light" },
                  ]).map((p) => (
                    <Card
                      key={p.value}
                      className={`cursor-pointer transition-all ${
                        programType === p.value
                          ? "border-primary ring-2 ring-primary/20"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setValue("programType", p.value)}
                    >
                      <CardContent className="p-3 text-center">
                        <p className="text-lg font-bold">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label>Durée du cycle</Label>
                <div className="grid grid-cols-2 gap-3">
                  {([4, 6] as const).map((weeks) => (
                    <Card
                      key={weeks}
                      className={`cursor-pointer transition-all ${
                        durationWeeks === weeks
                          ? "border-primary ring-2 ring-primary/20"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setValue("durationWeeks", weeks)}
                    >
                      <CardContent className="p-3 text-center">
                        <p className="text-lg font-bold">{weeks}</p>
                        <p className="text-xs text-muted-foreground">semaines</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Days per week (531 only) */}
              {programType === "531" && (
                <div className="space-y-3">
                  <Label>Jours par semaine</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {([3, 4, 5] as const).map((days) => (
                      <Card
                        key={days}
                        className={`cursor-pointer transition-all ${
                          daysPerWeek === days
                            ? "border-primary ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setValue("daysPerWeek", days)}
                      >
                        <CardContent className="p-3 text-center">
                          <p className="text-lg font-bold">{days}J</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Priority lift (531 + 4/5 days) */}
              {programType === "531" && daysPerWeek > 3 && (
                <div className="space-y-3">
                  <Label>Lift prioritaire (fréquence +)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "squat" as const, label: "Squat" },
                      { value: "bench" as const, label: "Bench" },
                      { value: "deadlift" as const, label: "Deadlift" },
                    ]).map((lift) => (
                      <Card
                        key={lift.value}
                        className={`cursor-pointer transition-all ${
                          priorityLift === lift.value
                            ? "border-primary ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => setValue("priorityLift", lift.value)}
                      >
                        <CardContent className="p-2 text-center">
                          <p className="text-sm font-medium">{lift.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ce lift sera travaillé {daysPerWeek === 4 ? "3" : "4"}x/semaine au lieu de 2x
                  </p>
                </div>
              )}

              {programType === "linear" && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    3 jours/semaine fixes. Chaque lift est travaillé à 3 intensités différentes par semaine.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                Précédent
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button type="button" onClick={handleNext}>
                Suivant
              </Button>
            ) : (
              <div className="space-y-2">
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Enregistrement..." : "Terminer"}
                </Button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
