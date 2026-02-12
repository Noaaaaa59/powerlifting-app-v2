"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

export default function LoginPage() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
          <Dumbbell className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold">NextPR</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Track your Squat, Bench Press and Deadlift progress
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button
        size="lg"
        onClick={handleGoogleSignIn}
        disabled={signingIn}
        className="gap-2"
      >
        {signingIn ? "Connexion..." : "Se connecter avec Google"}
      </Button>
    </div>
  );
}
