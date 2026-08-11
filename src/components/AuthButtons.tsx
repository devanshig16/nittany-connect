import { auth, signIn, signOut } from "@/lib/auth";

export async function AuthButtons() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/directory" });
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition hover:bg-accent-hover"
        >
          Sign in with Google
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href="/profile"
        className="text-sm font-medium text-neutral-700 transition hover:text-accent dark:text-neutral-300 dark:hover:text-accent"
      >
        {session.user.name}
      </a>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
