"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import axios from "axios";

type ReviewStatus = "APPROVED" | "REJECTED";

interface ReviewProjectInput {
  projectId: string;
  status: ReviewStatus;
}

export function useReviewProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, status }: ReviewProjectInput) => {
      const response = await api.patch(
        `/api/mentor/projects/${projectId}/review`,
        { status },
      );

      return { ...response.data, status };
    },

    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: ["mentor-projects"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["mentor-stats"],
      });

      if (result.status === "APPROVED") {
        toast.success("Project approved successfully!");
      } else {
        toast.success("Project rejected successfully.");
      }
    },

    onError: (error: Error) => {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.message;

        if (statusCode === 401 || statusCode === 403) {
          toast.error("Your session has expired or you lack permission.");
          return;
        }

        if (statusCode === 404) {
          toast.error("Project not found.");
          return;
        }

        if (statusCode === 409) {
          toast.error("This project has already been reviewed.");
          return;
        }

        toast.error(
          typeof message === "string"
            ? message
            : "Unable to review project. Please try again.",
        );
        return;
      }

      toast.error("Network error. Check your connection and try again.");
    },
  });
}
