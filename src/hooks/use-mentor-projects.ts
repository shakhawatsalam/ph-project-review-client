"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface MentorProject {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl: string | null;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export interface MentorProjectsResponse {
  projects: MentorProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseMentorProjectsParams {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}

export function useMentorProjects({
  page = 1,
  limit = 10,
  status,
}: UseMentorProjectsParams = {}) {
  return useQuery<MentorProjectsResponse>({
    queryKey: ["mentor-projects", { page, limit, status }],
    queryFn: async () => {
      const response = await api.get("/api/mentor/projects", {
        params: { page, limit, ...(status ? { status } : {}) },
      });

      return {
        projects: response.data.data as MentorProject[],
        pagination: response.data
          .pagination as MentorProjectsResponse["pagination"],
      };
    },
  });
}
