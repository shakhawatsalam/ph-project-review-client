"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, FolderKanban, XCircle } from "lucide-react";
import { useMentorStats } from "@/hooks/use-mentor-stats";

const projects = [
  {
    name: "My Portfolio Website",
    student: "Student One",
    status: "APPROVED",
  },
  {
    name: "Review Test Project",
    student: "Student Two",
    status: "APPROVED",
  },
];

export default function Home() {
  const { data, isLoading, isError } = useMentorStats();

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

  if (isLoading) {
    return <main className='p-10'>Loading dashboard statistics...</main>;
  }

  if (isError) {
    return (
      <main className='p-10'>
        Unable to load statistics. Please log in with a mentor account.
      </main>
    );
  }
  return (
    <main className='min-h-screen bg-muted/30'>
      <div className='mx-auto max-w-7xl space-y-8 p-6 md:p-10'>
        <header>
          <p className='text-sm font-medium text-muted-foreground'>
            PROJECT MANAGEMENT
          </p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight'>
            Project Review Dashboard
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Track submissions and manage project reviews.
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
                  <p className='text-3xl font-bold'>{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <p className='text-sm text-muted-foreground'>
              A preview of submitted projects.
            </p>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.name}>
                    <TableCell className='font-medium'>
                      {project.name}
                    </TableCell>
                    <TableCell>{project.student}</TableCell>
                    <TableCell>
                      <Badge>{project.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
