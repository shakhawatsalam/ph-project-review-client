"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectSubmissionForm() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/projects", {
        name,
        description,
        repoUrl,
        liveUrl: liveUrl || undefined,
      });

      return response.data;
    },

    onSuccess: async () => {
      toast.success("Project submitted successfully!");

      await queryClient.invalidateQueries({
        queryKey: ["my-project"],
      });

      setName("");
      setDescription("");
      setRepoUrl("");
      setLiveUrl("");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        toast.error(
          typeof message === "string"
            ? message
            : "Unable to submit your project.",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !description.trim() || !repoUrl.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      new URL(repoUrl);
      if (liveUrl.trim()) new URL(liveUrl);
    } catch {
      toast.error("Please enter valid URLs.");
      return;
    }

    submitMutation.mutate();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='project-name'>Project name *</Label>
            <Input
              id='project-name'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='My portfolio website'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='project-description'>Description *</Label>
            <Textarea
              id='project-description'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder='Describe your project and the technologies you used'
              rows={4}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='repository-url'>GitHub repository URL *</Label>
            <Input
              id='repository-url'
              type='url'
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder='https://github.com/username/project'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='live-url'>Live demo URL (optional)</Label>
            <Input
              id='live-url'
              type='url'
              value={liveUrl}
              onChange={(event) => setLiveUrl(event.target.value)}
              placeholder='https://my-project.vercel.app'
            />
          </div>

          <Button
            type='submit'
            disabled={submitMutation.isPending}
            className='w-full sm:w-auto'>
            {submitMutation.isPending ? "Submitting..." : "Submit Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
