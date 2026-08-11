import Link from "next/link";
import { auth } from "@/lib/auth";
import { AuthButtons } from "@/components/AuthButtons";

const steps = [
  {
    title: "Sign in",
    body: "Use your Google account to join. No new passwords to remember.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 15l3-3m0 0-3-3m3 3H9"
      />
    ),
  },
  {
    title: "Build a profile",
    body: "Share your occupation, industry, and what you're looking for.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.964 0a9 9 0 1 0-11.964 0m11.964 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    ),
  },
  {
    title: "Connect",
    body: "Browse other parents and reach out to talk business.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M8.25 15.75h7.5a2.25 2.25 0 0 0 2.25-2.25v-6a2.25 2.25 0 0 0-2.25-2.25h-7.5A2.25 2.25 0 0 0 6 7.5v6a2.25 2.25 0 0 0 2.25 2.25Zm0 0v3l3-3"
      />
    ),
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
      <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium tracking-wide text-accent-subtle-foreground uppercase">
        For Penn State parents
      </span>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Penn State parents, connected.
      </h1>
      <p className="mt-5 max-w-xl text-balance text-neutral-600 dark:text-neutral-400">
        A quiet space for parents of Penn State students to meet, talk trade,
        occupations, and business, and find ways to work together.
      </p>

      <div className="mt-8 flex items-center gap-4">
        {session?.user ? (
          <Link
            href="/directory"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:bg-accent-hover"
          >
            Browse the directory
          </Link>
        ) : (
          <AuthButtons />
        )}
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 text-left sm:mt-24 sm:grid-cols-3 sm:gap-8">
        {steps.map((step) => (
          <div key={step.title}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-subtle text-accent-subtle-foreground">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4.5 w-4.5"
                aria-hidden="true"
              >
                {step.icon}
              </svg>
            </div>
            <h2 className="mt-3 text-sm font-semibold">{step.title}</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
