import Link from "next/link";
import { AuthButtons } from "@/components/AuthButtons";
import { MobileNavToggle } from "@/components/MobileNavToggle";

export function NavBar() {
  const directoryLink = (
    <Link
      href="/directory"
      className="text-sm font-medium text-neutral-600 transition hover:text-accent dark:text-neutral-400 dark:hover:text-accent"
    >
      Directory
    </Link>
  );

  return (
    <header className="relative border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            N
          </span>
          Nittany Connect
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          {directoryLink}
          <AuthButtons />
        </nav>
        <MobileNavToggle>
          {directoryLink}
          <AuthButtons />
        </MobileNavToggle>
      </div>
    </header>
  );
}
