import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@/lib/avatar";

export default async function DirectoryProfilePage(
  props: PageProps<"/directory/[id]">
) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await props.params;

  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!profile || (!profile.isPublic && profile.userId !== session.user.id)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/directory"
        className="text-sm text-neutral-500 underline underline-offset-2"
      >
        ← Back to directory
      </Link>

      <div className="mt-6 flex items-center gap-4">
        {profile.user.image ? (
          <Image
            src={profile.user.image}
            alt={profile.user.name ?? "Member photo"}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 text-lg font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {getInitials(profile.user.name)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.user.name}
          </h1>
          {profile.location && (
            <p className="text-sm text-neutral-500">{profile.location}</p>
          )}
        </div>
      </div>

      {(profile.occupation || profile.company) && (
        <p className="mt-6 text-base">
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

      {profile.studentName && (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Parent of {profile.studentName}
          {profile.gradYear ? `, Class of ${profile.gradYear}` : ""}
        </p>
      )}

      {profile.bio && (
        <p className="mt-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {profile.bio}
        </p>
      )}

      {profile.lookingFor && (
        <p className="mt-4 text-sm text-neutral-500">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Looking for:
          </span>{" "}
          {profile.lookingFor}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {profile.user.email && (
          <a
            href={`mailto:${profile.user.email}`}
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Email {profile.user.name?.split(" ")[0] ?? "them"}
          </a>
        )}
        {profile.linkedinUrl && (
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-2"
          >
            LinkedIn
          </a>
        )}
        {profile.websiteUrl && (
          <a
            href={profile.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-2"
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}
