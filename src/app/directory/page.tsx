import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthButtons } from "@/components/AuthButtons";
import type { Prisma } from "@/generated/prisma/client";

type ProfileWithUser = Prisma.ProfileGetPayload<{ include: { user: true } }>;

export default async function DirectoryPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to browse the directory
        </h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          The directory is only visible to signed-in Nittany Connect members.
        </p>
        <div className="mt-6">
          <AuthButtons />
        </div>
      </div>
    );
  }

  const profiles = await prisma.profile.findMany({
    where: { isPublic: true },
    include: { user: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Directory</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Penn State parents open to connecting on trade, business, and
        occupation.
      </p>

      {profiles.length === 0 ? (
        <p className="mt-12 text-sm text-neutral-500">
          No public profiles yet.{" "}
          <Link href="/profile" className="underline">
            Be the first to add yours.
          </Link>
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {profiles.map((profile: ProfileWithUser) => (
            <li
              key={profile.id}
              className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                {profile.user.image && (
                  <Image
                    src={profile.user.image}
                    alt={profile.user.name ?? "Member photo"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{profile.user.name}</p>
                  {profile.location && (
                    <p className="text-xs text-neutral-500">
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>

              {(profile.occupation || profile.company) && (
                <p className="mt-3 text-sm">
                  {profile.occupation}
                  {profile.occupation && profile.company ? " at " : ""}
                  {profile.company}
                </p>
              )}

              {profile.industry && (
                <span className="mt-2 inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  {profile.industry}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
