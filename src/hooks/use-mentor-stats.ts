"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface MentorStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function useMentorStats() {
  return useQuery<MentorStats>({
    queryKey: ["mentor-stats"],
    queryFn: async () => {
      const response = await api.get("/api/mentor/stats");
      return response.data.data as MentorStats;
    },
  });
}
