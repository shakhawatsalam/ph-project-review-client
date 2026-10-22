"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "MENTOR";
}

export function useAuth() {
  return useQuery<AuthUser>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const response = await api.get("/api/auth/me");
      return response.data.data as AuthUser;
    },
    retry: false,
    staleTime: 30_000,
  });
}
