"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

type UserRole = "STUDENT" | "MENTOR";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();

  const { data: user, isLoading: authLoading, isError: authError } = useAuth();

  useEffect(() => {
    if (authError) {
      router.replace("/login");
      return;
    }

    if (user && user.role !== requiredRole) {
      const destination = user.role === "MENTOR" ? "/mentor" : "/student";

      router.replace(destination);
    }
  }, [user, authError, requiredRole, router]);

  if (authLoading || authError || !user || user.role !== requiredRole) {
    return (
      <main className='flex min-h-screen items-center justify-center'>
        <p className='text-sm text-muted-foreground'>
          Checking authentication...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
