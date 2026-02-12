"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Salut {user?.displayName?.split(" ")[0]} !
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Squat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-- kg</p>
            <p className="text-sm text-muted-foreground">Estimated 1RM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Bench
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-- kg</p>
            <p className="text-sm text-muted-foreground">Estimated 1RM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              Deadlift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-- kg</p>
            <p className="text-sm text-muted-foreground">Estimated 1RM</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
