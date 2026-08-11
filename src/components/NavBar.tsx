import Link from "next/link";
import { AuthButtons } from "@/components/AuthButtons";

export function NavBar() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Nittany Connect
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/directory"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Directory
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  );
}
