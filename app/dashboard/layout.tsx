"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userData, loading, refreshUserData } = useAuthStore();
  const router = useRouter();

  const showOnboarding = !loading && !!user && userData?.onboardingCompleted !== true;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleOnboardingComplete = async () => {
    await refreshUserData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Navbar />
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <OnboardingModal
          open={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
      </div>
    </ThemeProvider>
  );
}
