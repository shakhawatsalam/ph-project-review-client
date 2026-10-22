"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMentorStats } from "@/hooks/use-mentor-stats";
import { useState } from "react";
import { CheckCircle2, Clock3, FolderKanban, XCircle } from "lucide-react";
import { MentorProject, useMentorProjects } from "@/hooks/use-mentor-projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { useReviewProject } from "@/hooks/use-review-project";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MentorDashboardPage() {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [projectToReject, setProjectToReject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<MentorProject | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useMentorStats();
  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useMentorProjects({
    page: currentPage,
    limit: 5,
    ...(statusFilter !== "ALL"
      ? {
          status: statusFilter as "PENDING" | "APPROVED" | "REJECTED",
        }
      : {}),
  });
  const reviewMutation = useReviewProject();

  const stats = [
    {
      title: "Total Projects",
      value: data?.total ?? 0,
      icon: FolderKanban,
    },
    {
      title: "Pending Review",
      value: data?.pending ?? 0,
      icon: Clock3,
    },
    {
      title: "Approved",
      value: data?.approved ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Rejected",
      value: data?.rejected ?? 0,
      icon: XCircle,
    },
  ];

  if (isError) {
    return (
      <main className='p-10'>
        Unable to load statistics. Please sign in again.
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-muted/30 p-6 md:p-10'>
      <div className='mx-auto max-w-7xl space-y-8'>
        <header>
          <p className='text-sm font-medium text-muted-foreground'>
            MENTOR WORKSPACE
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight'>
            Mentor Dashboard
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Review student submissions and track project progress.
          </p>
        </header>

        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.title}>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {stat.title}
                  </CardTitle>
                  <Icon className='size-5 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className='h-9 w-16' />
                  ) : (
                    <p className='text-3xl font-bold'>{stat.value}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Project Submissions</CardTitle>
            <CardDescription>
              Review projects submitted by students.
            </CardDescription>
          </CardHeader>

          <div className='flex flex-wrap gap-2 px-6 pt-4'>
            {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(
              (status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size='sm'
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}>
                  {status === "ALL"
                    ? "All Projects"
                    : status === "PENDING"
                      ? "Pending"
                      : status === "APPROVED"
                        ? "Approved"
                        : "Rejected"}
                </Button>
              ),
            )}
          </div>

          <CardContent>
            {projectsLoading ? (
              <div className='space-y-3 py-6'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className='flex items-center gap-4'>
                    <Skeleton className='h-5 w-1/4' />
                    <Skeleton className='h-5 w-1/4' />
                    <Skeleton className='h-5 w-20' />
                    <Skeleton className='h-5 flex-1' />
                  </div>
                ))}
              </div>
            ) : projectsError ? (
              <p className='py-6 text-sm text-destructive'>
                Unable to load project submissions.
              </p>
            ) : !projects?.projects.length ? (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <FolderKanban className='mb-4 size-12 text-muted-foreground' />

                <h3 className='text-lg font-semibold'>
                  {statusFilter === "ALL"
                    ? "No projects yet"
                    : `No ${statusFilter.toLowerCase()} projects`}
                </h3>

                <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
                  {statusFilter === "ALL"
                    ? "Student submissions will appear here when they submit their projects."
                    : "There are no projects matching this filter right now. Try another status or view all projects."}
                </p>

                {statusFilter !== "ALL" && (
                  <Button
                    variant='outline'
                    className='mt-4'
                    onClick={() => {
                      setStatusFilter("ALL");
                      setCurrentPage(1);
                    }}>
                    View all projects
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Repository</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {projects.projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className='font-medium'>
                        {project.name}
                      </TableCell>
                      <TableCell>
                        <div>{project.student.name}</div>
                        <div className='text-xs text-muted-foreground'>
                          {project.student.email}
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <a
                          href={project.repoUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm underline underline-offset-4'>
                          View repository
                        </a>
                      </TableCell>

                      <TableCell>
                        <div className='flex flex-wrap gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setSelectedProject(project)}>
                            View Details
                          </Button>

                          {project.status === "PENDING" && (
                            <>
                              <Button
                                size='sm'
                                disabled={reviewMutation.isPending}
                                onClick={() =>
                                  reviewMutation.mutate({
                                    projectId: project.id,
                                    status: "APPROVED",
                                  })
                                }>
                                Approve
                              </Button>

                              <Button
                                size='sm'
                                variant='destructive'
                                disabled={reviewMutation.isPending}
                                onClick={() => setProjectToReject(project.id)}>
                                Reject
                              </Button>
                            </>
                          )}

                          {project.status !== "PENDING" && (
                            <span className='self-center text-sm text-muted-foreground'>
                              Reviewed
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className='flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-sm text-muted-foreground'>
                Page {projects?.pagination.page ?? currentPage} of{" "}
                {projects?.pagination.totalPages ?? 1}
                {" · "}
                {projects?.pagination.total ?? 0} projects
              </p>

              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={currentPage <= 1 || projectsLoading}
                  onClick={() => setCurrentPage((page) => page - 1)}>
                  Previous
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  disabled={
                    projectsLoading ||
                    currentPage >= (projects?.pagination.totalPages ?? 1)
                  }
                  onClick={() => setCurrentPage((page) => page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={projectToReject !== null}
          onOpenChange={(open) => {
            if (!open) setProjectToReject(null);
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject this project?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The student’s submission will be
                marked as rejected.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setProjectToReject(null)}>
                Cancel
              </Button>

              <Button
                variant='destructive'
                disabled={reviewMutation.isPending}
                onClick={() => {
                  if (!projectToReject) return;

                  reviewMutation.mutate(
                    {
                      projectId: projectToReject,
                      status: "REJECTED",
                    },
                    {
                      onSuccess: () => setProjectToReject(null),
                    },
                  );
                }}>
                {reviewMutation.isPending
                  ? "Rejecting..."
                  : "Confirm rejection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={selectedProject !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedProject(null);
          }}>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
              <DialogDescription>
                Review the student&apos;s project submission.
              </DialogDescription>
            </DialogHeader>

            {selectedProject && (
              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Project Name</p>
                  <p className='font-medium'>{selectedProject.name}</p>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Student</p>
                  <p className='font-medium'>{selectedProject.student.name}</p>
                  <p className='text-sm'>{selectedProject.student.email}</p>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Description</p>
                  <p className='whitespace-pre-wrap text-sm'>
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Repository</p>
                  <a
                    href={selectedProject.repoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='break-all text-primary underline'>
                    {selectedProject.repoUrl}
                  </a>
                </div>

                {selectedProject.liveUrl && (
                  <div>
                    <p className='text-sm text-muted-foreground'>Live Demo</p>
                    <a
                      href={selectedProject.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='break-all text-primary underline'>
                      {selectedProject.liveUrl}
                    </a>
                  </div>
                )}

                <div>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <p className='font-medium'>{selectedProject.status}</p>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Submitted</p>
                  <p className='text-sm'>
                    {new Date(selectedProject.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
