"use client";
import { useMyProject } from "@/hooks/use-my-project";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectSubmissionForm from "@/components/student/project-submission-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import AuthGuard from "@/components/auth/auth-guard";
export default function StudentDashboardPage() {
  const { data: project, isLoading, isError } = useMyProject();
  const queryClient = useQueryClient();
  const router = useRouter();

  // log-out handler
  async function handleLogout() {
    try {
      await api.post("/api/auth/logout");
      await queryClient.invalidateQueries();

      toast.success("Logged out successfully.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  }

  return (
    <AuthGuard requiredRole='STUDENT'>
      <main className='min-h-screen bg-muted/30 p-6 md:p-10'>
        <div className='mx-auto max-w-5xl space-y-8'>
          <header>
            <p className='text-sm font-medium text-muted-foreground'>
              STUDENT WORKSPACE
            </p>

            <h1 className='mt-2 text-3xl font-bold tracking-tight'>
              Student Dashboard
            </h1>

            <p className='mt-2 text-muted-foreground'>
              Submit your project and track its review status.
            </p>
            <Button variant='outline' onClick={handleLogout}>
              Logout
            </Button>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>My Project Submission</CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className='space-y-3'>
                  <Skeleton className='h-5 w-1/3' />
                  <Skeleton className='h-4 w-2/3' />
                  <Skeleton className='h-8 w-24' />
                </div>
              ) : isError ? (
                <p className='text-sm text-destructive'>
                  Unable to load your project. Please sign in again and try
                  again.
                </p>
              ) : !project ? (
                <ProjectSubmissionForm />
              ) : (
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>{project.name}</h3>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {project.description}
                    </p>
                  </div>

                  <Badge
                    variant={
                      project.status === "APPROVED"
                        ? "default"
                        : project.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                    }>
                    {project.status}
                  </Badge>

                  <div>
                    <p className='text-sm text-muted-foreground'>Repository</p>
                    <a
                      href={project.repoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='break-all text-sm text-primary underline'>
                      {project.repoUrl}
                    </a>
                  </div>

                  {project.liveUrl && (
                    <div>
                      <p className='text-sm text-muted-foreground'>Live Demo</p>
                      <a
                        href={project.liveUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='break-all text-sm text-primary underline'>
                        {project.liveUrl}
                      </a>
                    </div>
                  )}

                  <p className='text-xs text-muted-foreground'>
                    Submitted:{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthGuard>
  );
}
