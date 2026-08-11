import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthButtons } from "@/components/AuthButtons";
import { getInitials } from "@/lib/avatar";
import type { Prisma } from "@/generated/prisma/client";

type ProfileWithUser = Prisma.ProfileGetPayload<{ include: { user: true } }>;

const fieldClass =
  "rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-neutral-500 dark:border-neutral-700 dark:focus:border-neutral-400";

export default async function DirectoryPage(props: PageProps<"/directory">) {
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

  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const industry =
    typeof searchParams.industry === "string" ? searchParams.industry : "";
  const location =
    typeof searchParams.location === "string"
      ? searchParams.location.trim()
      : "";
  const pageSize = 12;
  const requestedPage =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const where: Prisma.ProfileWhereInput = {
    isPublic: true,
    ...(industry ? { industry } : {}),
    ...(location
      ? { location: { contains: location, mode: "insensitive" } }
      : {}),
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { occupation: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
            { lookingFor: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [profiles, totalCount, industryRows, ownProfile] = await Promise.all([
    prisma.profile.findMany({
      where,
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.profile.count({ where }),
    prisma.profile.findMany({
      where: { isPublic: true, industry: { not: null } },
      select: { industry: true },
      distinct: ["industry"],
      orderBy: { industry: "asc" },
    }),
    prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    }),
  ]);

  const industries = industryRows
    .map((row) => row.industry)
    .filter((value): value is string => Boolean(value));

  const hasFilters = Boolean(q || industry || location);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (industry) params.set("industry", industry);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `/directory?${query}` : "/directory";
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Directory</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Penn State parents open to connecting on trade, business, and
        occupation.
      </p>

      {!ownProfile && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            You haven&apos;t created your profile yet — other parents can&apos;t
            find or contact you until you do.
          </p>
          <Link
            href="/profile"
            className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Complete your profile
          </Link>
        </div>
      )}

      <form className="mt-8 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, role, or bio"
          className={`${fieldClass} min-w-50 flex-1`}
        />
        <input
          type="text"
          name="location"
          defaultValue={location}
          placeholder="Location"
          className={`${fieldClass} w-40`}
        />
        <select name="industry" defaultValue={industry} className={`${fieldClass} w-44`}>
          <option value="">All industries</option>
          {industries.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Filter
        </button>
        {hasFilters && (
          <Link
            href="/directory"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
          >
            Clear
          </Link>
        )}
      </form>

      {profiles.length === 0 ? (
        <p className="mt-12 text-sm text-neutral-500">
          {hasFilters ? (
            "No profiles match those filters."
          ) : (
            <>
              No public profiles yet.{" "}
              <Link href="/profile" className="underline">
                Be the first to add yours.
              </Link>
            </>
          )}
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {profiles.map((profile: ProfileWithUser) => (
            <li
              key={profile.id}
              className="rounded-xl border border-neutral-200 p-5 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <Link href={`/directory/${profile.id}`} className="block">
                <div className="flex items-center gap-3">
                  {profile.user.image ? (
                    <Image
                      src={profile.user.image}
                      alt={profile.user.name ?? "Member photo"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      {getInitials(profile.user.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {profile.user.name}
                      {profile.userId === session.user.id && (
                        <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-normal text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          You
                        </span>
                      )}
                    </p>
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

                {profile.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {profile.bio}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {profiles.length > 0 && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 ? (
            <Link
              href={buildPageHref(page - 1)}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
            >
              Prev
            </Link>
          ) : (
            <span className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-400 dark:border-neutral-800 dark:text-neutral-600">
              Prev
            </span>
          )}
          <span className="text-sm text-neutral-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={buildPageHref(page + 1)}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-500"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-400 dark:border-neutral-800 dark:text-neutral-600">
              Next
            </span>
          )}
        </div>
      )}
    </div>
  );
}
