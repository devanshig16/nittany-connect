import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  const initial = {
    studentName: profile?.studentName ?? "",
    gradYear: profile?.gradYear?.toString() ?? "",
    location: profile?.location ?? "",
    occupation: profile?.occupation ?? "",
    industry: profile?.industry ?? "",
    company: profile?.company ?? "",
    bio: profile?.bio ?? "",
    lookingFor: profile?.lookingFor ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    websiteUrl: profile?.websiteUrl ?? "",
    isPublic: profile?.isPublic ?? true,
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:py-16">
      <div className="mb-10 flex items-center gap-4">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "Profile photo"}
            width={56}
            height={56}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {session.user.name}
          </h1>
          <p className="text-sm text-neutral-500">{session.user.email}</p>
        </div>
      </div>

      <ProfileForm initial={initial} />
    </div>
  );
}
