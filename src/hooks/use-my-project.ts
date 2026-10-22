"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import axios from "axios";

export interface MyProject {
  id: string;
  name: string;
  repoUrl: string;
  liveUrl: string | null;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export function useMyProject() {
  return useQuery<MyProject | null>({
    queryKey: ["my-project"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/projects/mine");

        if (response.data.success === false) {
          return null;
        }

        return response.data.data as MyProject;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
  });
}
