export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Penn State parents, connected.
      </h1>
      <p className="mt-5 max-w-xl text-balance text-neutral-600 dark:text-neutral-400">
        A quiet space for parents of Penn State students to meet, talk trade,
        occupations, and business, and find ways to work together.
      </p>

      <div className="mt-20 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Use your Google account to join. No new passwords to remember.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Build a profile</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Share your occupation, industry, and what you&apos;re looking for.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Connect</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Browse other parents and reach out to talk business.
          </p>
        </div>
      </div>
    </div>
  );
}
