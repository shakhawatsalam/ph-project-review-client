import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Submit Projects",
    description:
      "Submit your project details and repository link, then track your submission status.",
  },
  {
    icon: CheckCircle2,
    title: "Track Reviews",
    description:
      "Check whether your project is pending, approved, or rejected.",
  },
  {
    icon: ShieldCheck,
    title: "Mentor Dashboard",
    description:
      "Give mentors a dedicated workspace to review submissions and manage project decisions.",
  },
];

export default function Home() {
  return (
    <main className='min-h-screen bg-background text-foreground'>
      {/* Navigation */}
      <header className='border-b'>
        <nav
          aria-label='Main navigation'
          className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8'>
          <Link
            href='/'
            aria-label='Project Review Dashboard home'
            className='text-lg font-bold tracking-tight'>
            Project Review
          </Link>

          <div className='flex items-center gap-3'>
            <Link
              href='/login'
              className='rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
              Log in
            </Link>

            <Link
              href='/signup'
              className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className='mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32'>
        <div className='mx-auto max-w-3xl text-center'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm font-medium'>
            <GraduationCap aria-hidden='true' className='size-4' />
            Student Project Management
          </div>

          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
            Submit projects.
            <span className='block text-primary'>Get meaningful reviews.</span>
          </h1>

          <p className='mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg'>
            A simple workspace for students to submit projects and track
            progress, and for mentors to review work and make decisions.
          </p>

          <div className='mt-9 flex flex-col justify-center gap-3 sm:flex-row'>
            <Link
              href='/signup'
              className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
              Get started
              <ArrowRight aria-hidden='true' className='size-4' />
            </Link>

            <Link
              href='/login'
              className='inline-flex min-h-11 items-center justify-center rounded-lg border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
              Log in to your account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        aria-labelledby='features-heading'
        className='border-t bg-muted/30'>
        <div className='mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20'>
          <div className='mx-auto mb-10 max-w-2xl text-center'>
            <h2
              id='features-heading'
              className='text-2xl font-bold tracking-tight sm:text-3xl'>
              Everything in one place
            </h2>

            <p className='mt-3 text-muted-foreground'>
              A dedicated workflow for project submissions and mentor reviews.
            </p>
          </div>

          <div className='grid gap-5 md:grid-cols-3'>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className='rounded-xl border bg-card p-6 shadow-sm'>
                  <div className='mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10'>
                    <Icon aria-hidden='true' className='size-5 text-primary' />
                  </div>

                  <h3 className='text-lg font-semibold'>{feature.title}</h3>

                  <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t'>
        <div className='mx-auto max-w-7xl px-5 py-6 text-center text-sm text-muted-foreground sm:px-8'>
          Project Review Dashboard
        </div>
      </footer>
    </main>
  );
}
